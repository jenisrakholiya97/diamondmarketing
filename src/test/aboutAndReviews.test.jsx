import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { AboutPage } from '../pages/AboutPage';
import { ReviewSection } from '../components/ReviewSection';

const renderWithContext = (ui) => {
  return render(
    <ShopProvider>
      {ui}
    </ShopProvider>
  );
};

describe('AboutPage and Review Rating Suite', () => {
  it('renders AboutPage with full company history timeline and Surat desk story', () => {
    renderWithContext(<AboutPage />);

    // Check main title and tagline
    expect(screen.getByText(/From Surat Cutting Desk to Global Trade Partner/i)).toBeInTheDocument();
    expect(screen.getByText(/Company History & Evolution/i)).toBeInTheDocument();

    // Check timeline milestones
    expect(screen.getByText(/Established in Surat, Gujarat/i)).toBeInTheDocument();
    expect(screen.getByText(/CVD & HPHT Lab-Growth Direct Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/360° HD Macro Studio & Cert Verification/i)).toBeInTheDocument();
  });

  it('renders operational process steps and switches active step tabs', () => {
    renderWithContext(<AboutPage />);

    expect(screen.getByText(/1. Primary Selection at Surat Source/i)).toBeInTheDocument();

    // Click step 3 tab
    const step3Button = screen.getByText(/Daylight Calibrated Video/i);
    fireEvent.click(step3Button);

    expect(screen.getByText(/3. 360° HD Macro Studio Filming/i)).toBeInTheDocument();
  });

  it('renders team members section with updated founder name and no natural diamond tab', () => {
    renderWithContext(<AboutPage />);

    expect(screen.getByText(/Meet the Gemologists & Sourcing Specialists/i)).toBeInTheDocument();
    expect(screen.getByText(/Aarav Shah/i)).toBeInTheDocument();
    expect(screen.queryByText(/Nivvan Rakholiya/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jenis Rakholiya/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Rupesh Patel/i)).toBeInTheDocument();

    // Verify Natural (GIA) filter tab is removed on AboutPage ReviewSection
    expect(screen.queryByRole('button', { name: /Natural \(GIA\)/i })).not.toBeInTheDocument();
  });

  it('renders ReviewSection with rating summary, filters, and review submission modal', async () => {
    renderWithContext(<ReviewSection title="Verified Trade Client Ratings & Reviews" />);

    // Check score banner defaults to 0.0 when no user reviews submitted yet
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.queryByText(/Marcus Vance/i)).not.toBeInTheDocument();
    expect(screen.getByText(/No User Reviews Submitted Yet/i)).toBeInTheDocument();

    // Open submission modal
    const writeReviewBtns = screen.getAllByRole('button', { name: /Write.*Trade Review/i });
    fireEvent.click(writeReviewBtns[0]);

    expect(screen.getByText(/Submit Surat.*Sourcing Review/i)).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/e.g. Marcus Vance/i), { target: { value: 'Test Bench Jeweler' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Vance Custom Jewelry Atelier/i), { target: { value: 'Test Atelier' } });
    fireEvent.change(screen.getByPlaceholderText(/Summarize your experience in one sentence/i), { target: { value: 'Great experience sourcing oval diamonds' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe stone optics/i), { target: { value: 'The 360 HD video matched the stone under 20x loupe completely.' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Submit Trade Review/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Trade Review Submitted!/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
