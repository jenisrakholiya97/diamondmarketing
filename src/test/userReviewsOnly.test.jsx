import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ReviewSection } from '../components/ReviewSection';
import { INITIAL_REVIEWS } from '../data/reviewsData';

describe('User Reviews Only (Zero Default Initialized Reviews) Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('case 1: verifies INITIAL_REVIEWS dataset is empty (0 default reviews)', () => {
    expect(INITIAL_REVIEWS).toEqual([]);
  });

  it('case 2: starts with 0 default reviews and renders empty state container', () => {
    render(
      <ShopProvider>
        <ReviewSection />
      </ShopProvider>
    );

    // Verify rating stats start at zero
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText(/Based on 0 verified trade orders/i)).toBeInTheDocument();

    // Verify mock authors are completely absent
    ['Marcus Vance', 'Eleanor Thorne', 'David Sterling', 'Sarah Jenkins', 'Robert DeLuca', 'Hannah Lindqvist'].forEach((mockAuthor) => {
      expect(screen.queryByText(new RegExp(mockAuthor, 'i'))).not.toBeInTheDocument();
    });

    // Verify empty state container
    expect(screen.getByText(/No User Reviews Submitted Yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Write First Trade Review Now/i })).toBeInTheDocument();
  });

  it('case 3: allows submitting real user review and dynamically updates rating summary and list', async () => {
    render(
      <ShopProvider>
        <ReviewSection />
      </ShopProvider>
    );

    // Open review modal via empty state button
    const writeBtn = screen.getByRole('button', { name: /Write First Trade Review Now/i });
    fireEvent.click(writeBtn);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/e.g. Marcus Vance/i), { target: { value: 'Sophia Lorenzo' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Vance Custom Jewelry Atelier/i), { target: { value: 'Lorenzo Bespoke Gems' } });
    fireEvent.change(screen.getByPlaceholderText(/Summarize your experience in one sentence/i), { target: { value: 'Exquisite CVD diamond optical clarity' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe stone optics/i), { target: { value: 'Direct Surat dispatch arrived in 5 days with flawless 360 HD video match.' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Submit Trade Review/i });
    fireEvent.click(submitBtn);

    // Wait for submission confirmation
    await waitFor(() => {
      expect(screen.getByText(/Trade Review Submitted!/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /Close review modal/i }));

    // Verify real user review card appears in DOM
    expect(await screen.findByText('Sophia Lorenzo')).toBeInTheDocument();
    expect(screen.getByText('Lorenzo Bespoke Gems')).toBeInTheDocument();
    expect(screen.getByText(/"Exquisite CVD diamond optical clarity"/i)).toBeInTheDocument();

    // Verify stats updated dynamically to 1 review and 5.0 rating
    expect(screen.getByText('5.0')).toBeInTheDocument();
    expect(screen.getByText(/Based on 1 verified trade orders/i)).toBeInTheDocument();
  });

  it('case 4: persists user-submitted reviews in localStorage across component re-mounts', async () => {
    const userReview = [
      {
        id: 'rev-user-77',
        author: 'Alexander Wright',
        role: 'Bench Jeweler',
        studio: 'Wright Fine Jewelry',
        location: 'Chicago, IL, USA',
        flag: '🇺🇸',
        rating: 5,
        date: '2026-10-02',
        verified: true,
        stoneSpec: '2.50ct Round Lab-Grown',
        category: 'Lab-Grown',
        metrics: { optics: 5, videoAccuracy: 5, delivery: 5, pricing: 5 },
        title: 'Perfect cut symmetry',
        content: 'Surat direct pricing cut out middleman brokers for our Chicago bench.',
        helpfulCount: 2
      }
    ];
    localStorage.setItem('gk_user_reviews', JSON.stringify(userReview));

    render(
      <ShopProvider>
        <ReviewSection />
      </ShopProvider>
    );

    // Verify persisted review renders immediately from storage
    expect(screen.getByText((content) => content.includes('Based on') && content.includes('1'))).toBeInTheDocument();
  });

  it('case 5: increments helpful counter on user review card when clicked', async () => {
    const userReview = [
      {
        id: 'rev-user-88',
        author: 'Claire Bennett',
        role: 'Custom Designer',
        studio: 'Bennett Atelier',
        location: 'London, UK',
        flag: '🇬🇧',
        rating: 5,
        date: '2026-10-02',
        verified: true,
        stoneSpec: '3.00ct Emerald Cut Lab-Grown',
        category: 'Lab-Grown',
        metrics: { optics: 5, videoAccuracy: 5, delivery: 5, pricing: 5 },
        title: 'Outstanding quality',
        content: 'Insured transit to London took 6 days.',
        helpfulCount: 5
      }
    ];
    localStorage.setItem('gk_user_reviews', JSON.stringify(userReview));

    render(
      <ShopProvider>
        <ReviewSection />
      </ShopProvider>
    );

    expect(await screen.findByText('Claire Bennett')).toBeInTheDocument();
    const helpfulBtn = screen.getByRole('button', { name: /Helpful \(5\)/i });
    expect(helpfulBtn).toBeInTheDocument();

    fireEvent.click(helpfulBtn);

    // Verify count incremented to 6 and button is disabled
    expect(await screen.findByRole('button', { name: /Helpful \(6\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Helpful \(6\)/i })).toBeDisabled();
  });
});
