import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { QuoteModal } from '../components/QuoteModal';

const TestAppWithMediaAndQuoteModal = () => {
  return (
    <ShopProvider>
      <ProductsPage />
      <QuoteModal />
    </ShopProvider>
  );
};

describe('Product Media Gallery & Quote Modal Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([
      {
        id: 'test-media-1',
        title: '1.50 Ct Round Diamond',
        shape: 'Round Brilliant',
        carat: '1.50 Ct',
        color: 'D',
        clarity: 'VVS1',
        price: '$1,500.00',
        certNumber: 'IGI-9999',
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        isCustomAdded: true
      }
    ]));
    window.scrollTo = vi.fn();
  });

  it('opens Gem360 media gallery modal, then triggers Official Quote modal on top', async () => {
    render(<TestAppWithMediaAndQuoteModal />);

    // Click "View Media Gallery" button using open-media-gallery-button testid
    const viewMediaBtns = screen.getAllByTestId('open-media-gallery-button');
    expect(viewMediaBtns.length).toBeGreaterThan(0);
    fireEvent.click(viewMediaBtns[0]);

    // Verify Gem360 Media Gallery modal is open
    expect(screen.getByText(/Media Gallery/i)).toBeInTheDocument();
    const mediaQuoteBtn = screen.getByRole('button', { name: /Request Official USD Quote/i });
    expect(mediaQuoteBtn).toBeInTheDocument();

    // Click "Request Official USD Quote" inside media gallery modal
    fireEvent.click(mediaQuoteBtn);

    // Verify QuoteModal is now rendered and visible on top with high z-index overlay
    await waitFor(() => {
      expect(screen.getByText('Request Official B2B Quotation')).toBeInTheDocument();
    });

    // Check prefilled specs inside QuoteForm reflect the selected diamond
    const specsInput = screen.getByLabelText(/Diamond Specifications & Requirements/i);
    expect(specsInput.value).toContain('Requesting USD Quote');
  }, 15000);
});
