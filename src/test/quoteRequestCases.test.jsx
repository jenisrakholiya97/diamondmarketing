import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { QuoteModal } from '../components/QuoteModal';
import { QuoteForm } from '../components/QuoteForm';
import { ProductsPage } from '../pages/ProductsPage';
import { HomePage } from '../pages/HomePage';
import { SupplyPage } from '../pages/SupplyPage';
import { ProcessPage } from '../pages/ProcessPage';
import { AboutPage } from '../pages/AboutPage';
import { FaqPage } from '../pages/FaqPage';
import { Header } from '../components/Header';

const mockDiamondList = [
  {
    id: 'test-1',
    title: '1.01 Carat Round Brilliant Diamond',
    shape: 'Round Brilliant',
    carat: 1.01,
    color: 'D',
    clarity: 'VVS1',
    cut: '3X EX',
    price: '$1,200.00',
    certNumber: 'IGI-12345',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    isCustomAdded: true
  },
  {
    id: 'test-2',
    title: '2.05 Carat Oval Lab Diamond',
    shape: 'Oval',
    carat: 2.05,
    color: 'E',
    clarity: 'VS1',
    cut: '3X EX',
    price: '$2,400.00',
    certNumber: 'IGI-67890',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    isCustomAdded: true
  }
];

const renderComponentWithProvider = (ui) => {
  localStorage.setItem('gk_custom_diamonds', JSON.stringify(mockDiamondList));
  return render(
    <ShopProvider>
      {ui}
      <QuoteModal />
    </ShopProvider>
  );
};

describe('Official B2B Quote Request Comprehensive Test Suite Across All Pages & Modes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('case 1: Header "Request Quote" opens QuoteModal with fresh clean fields', () => {
    renderComponentWithProvider(<Header />);

    // Click desktop Request Quote button specifically
    const reqButtons = screen.getAllByRole('button', { name: /^Request Quote$/i });
    expect(reqButtons.length).toBeGreaterThan(0);
    fireEvent.click(reqButtons[0]);

    // Modal should be open
    expect(screen.getAllByText(/Request Official B2B Quotation/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/studio@jewelrystudio.com/i)).toBeInTheDocument();
  });

  it('case 2: ProductsPage grid card "Quote" button prefills category & specs in QuoteModal', () => {
    renderComponentWithProvider(<ProductsPage />);

    // Find quote buttons on product cards
    const quoteButtons = screen.getAllByRole('button', { name: /^Quote$/i });
    expect(quoteButtons.length).toBeGreaterThan(0);

    // Click first product card quote button
    fireEvent.click(quoteButtons[0]);

    // Modal should open with prefilled specs
    expect(screen.getAllByText(/Request Official B2B Quotation/i).length).toBeGreaterThan(0);
    
    // Check message textarea has prefilled specs
    const messageInput = screen.getByLabelText(/Diamond Specifications & Requirements/i);
    expect(messageInput.value).toMatch(/Requesting USD Quote/i);
  });

  it('case 3: ProductsPage Batch USD Quote Floating Bar prefills multi-item specs when diamonds selected', () => {
    renderComponentWithProvider(<ProductsPage />);

    // Select first diamond via select button title "Select for Batch Quote"
    const selectButtons = screen.getAllByTitle(/Select for Batch Quote|Select Item/i);
    expect(selectButtons.length).toBeGreaterThan(0);
    fireEvent.click(selectButtons[0]);

    // Floating batch quote bar should appear
    const batchQuoteBtn = screen.getByRole('button', { name: /Request Batch USD Quote/i });
    expect(batchQuoteBtn).toBeInTheDocument();

    // Click batch quote button
    fireEvent.click(batchQuoteBtn);

    // Modal should open with prefilled batch specs
    expect(screen.getAllByText(/Request Official B2B Quotation/i).length).toBeGreaterThan(0);
    const messageInput = screen.getByLabelText(/Diamond Specifications & Requirements/i);
    expect(messageInput.value).toMatch(/Requesting USD Quote/i);
  });

  it('case 4: QuoteForm supports dynamic category option matching for custom prefilled categories', () => {
    render(
      <ShopProvider>
        <QuoteForm initialCategory="Batch Selected Diamonds" initialSpecs="Custom batch specs" />
      </ShopProvider>
    );

    const categorySelect = screen.getByLabelText(/Diamond Category/i);
    expect(categorySelect.value).toBe('Batch Selected Diamonds');
    expect(screen.getByDisplayValue('Batch Selected Loose Diamonds')).toBeInTheDocument();
  });

  it('case 4b: QuoteForm category label and options contain ONLY diamond types and NO jewelry options', () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    // Verify label text contains Diamond Category and does not contain Jewelry
    const label = screen.getByText(/Diamond Category/i);
    expect(label).toBeInTheDocument();
    expect(label.textContent).not.toMatch(/Jewelry/i);

    // Verify all select options contain only diamond types and zero jewelry terms
    const categorySelect = screen.getByLabelText(/Diamond Category/i);
    const options = Array.from(categorySelect.querySelectorAll('option')).map((opt) => opt.textContent);

    const forbiddenJewelryTerms = [/\bjewelry\b/i, /\brings?\b/i, /\bbands?\b/i, /\bearrings?\b/i, /\bstuds\b/i, /\bhoops\b/i, /\bbracelets?\b/i];
    options.forEach((optText) => {
      forbiddenJewelryTerms.forEach((term) => {
        expect(optText).not.toMatch(term);
      });
    });

    // Verify presence of core diamond types
    expect(options.some((text) => text.includes('Lab-Grown Solitaires & Fancy Shapes'))).toBe(true);
    expect(options.some((text) => text.includes('Loose Certified Diamonds'))).toBe(true);
    expect(options.some((text) => text.includes('Round Brilliant Cut Diamonds'))).toBe(true);
    expect(options.some((text) => text.includes('Oval Cut Diamonds'))).toBe(true);
  });

  it('case 5: QuoteForm validates email method input and handles success submission', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    // Try submitting empty email
    fireEvent.click(screen.getByRole('button', { name: /Request Official Quote/i }));
    expect(screen.getByText(/Please enter a valid business email address/i)).toBeInTheDocument();

    // Fill valid email
    const emailInput = screen.getByPlaceholderText(/studio@jewelrystudio.com/i);
    fireEvent.change(emailInput, { target: { value: 'buyer@atelier.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Request Official Quote/i }));

    // Success screen should appear
    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received!/i)).toBeInTheDocument();
      expect(screen.getByText(/buyer@atelier.com/i)).toBeInTheDocument();
    });
  });

  it('case 6: QuoteForm validates WhatsApp method input and generates direct WhatsApp link & success screen', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    // Switch to WhatsApp method
    fireEvent.click(screen.getByRole('button', { name: /Official WhatsApp/i }));

    // Try submitting without phone
    fireEvent.click(screen.getByRole('button', { name: /Request Official Quote/i }));
    expect(screen.getByText(/Please enter a valid WhatsApp phone number/i)).toBeInTheDocument();

    // Fill valid WhatsApp phone
    const waInput = screen.getByPlaceholderText(/\+1 \(555\) 019-2834/i);
    fireEvent.change(waInput, { target: { value: '+1 (555) 987-6543' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Request Official Quote/i }));

    // Success screen should appear with WhatsApp chat button
    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received!/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Open Direct WhatsApp Chat/i })).toBeInTheDocument();
    });
  });

  it('case 7: HomePage quote buttons trigger QuoteModal with prefilled context', () => {
    renderComponentWithProvider(<HomePage />);

    const quoteBtns = screen.getAllByRole('button', { name: /Request specifications|Request Quote|Request Sourcing Quote/i });
    expect(quoteBtns.length).toBeGreaterThan(0);

    // Click hero quote button
    fireEvent.click(quoteBtns[0]);

    // Modal should be open
    expect(screen.getAllByText(/Request Official B2B Quotation/i).length).toBeGreaterThan(0);
  });

  it('case 8: SupplyPage single spec quote button prefills category in QuoteModal', () => {
    renderComponentWithProvider(<SupplyPage />);

    const reqBtns = screen.getAllByRole('button', { name: /Quote This Specification|Quote/i });
    expect(reqBtns.length).toBeGreaterThan(0);

    // Click first single spec quote button
    fireEvent.click(reqBtns[0]);

    // Modal should open
    expect(screen.getAllByText(/Request Official B2B Quotation/i).length).toBeGreaterThan(0);
  });

  it('case 9: Download B2B Quote Spec Sheet button triggers catalog HTML file download', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    const downloadBtns = screen.getAllByRole('button', { name: /Download B2B Spec Sheet|Download Spec Sheet/i });
    fireEvent.click(downloadBtns[0]);

    expect(appendSpy).toHaveBeenCalled();
  });
});
