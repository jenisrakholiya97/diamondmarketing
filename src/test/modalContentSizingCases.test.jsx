import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { HomePage } from '../pages/HomePage';
import { QuoteModal } from '../components/QuoteModal';
import { DeleteProductModal } from '../components/DeleteProductModal';
import { ReviewModal } from '../components/ReviewModal';

const renderProductsPageWithContext = () => {
  return render(
    <ShopProvider>
      <ProductsPage />
      <QuoteModal />
    </ShopProvider>
  );
};

const renderHomePageWithContext = () => {
  return render(
    <ShopProvider>
      <HomePage />
      <QuoteModal />
    </ShopProvider>
  );
};

describe('Modal Sizing & Content-Based Space Fitting Integration Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('case 1: ProductsPage Inspect 360 modal opens with content-fitted space bounds (no full screen stretch)', async () => {
    renderProductsPageWithContext();

    await waitFor(() => {
      const viewMediaButtons = screen.getAllByTestId('open-media-gallery-button');
      expect(viewMediaButtons.length).toBeGreaterThan(0);
    });

    const viewMediaButtons = screen.getAllByTestId('open-media-gallery-button');
    fireEvent.click(viewMediaButtons[0]);

    // Inspect 360 Modal should be visible
    const mediaGalleryHeading = screen.getByText(/Media Gallery/i);
    expect(mediaGalleryHeading).toBeInTheDocument();

    // Verify backdrop container allows padding around viewport
    const backdropOverlay = mediaGalleryHeading.closest('.modal-backdrop-overlay');
    expect(backdropOverlay).toBeInTheDocument();
    expect(backdropOverlay.className).toContain('fixed inset-0');
    expect(backdropOverlay.className).toContain('items-center justify-center');

    // Verify modal content container uses dynamic max height & auto margin rather than 92vh full-screen force
    const modalContent = mediaGalleryHeading.closest('.shadow-2xl');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent.className).toContain('max-h-[85vh]');
    expect(modalContent.className).not.toContain('max-h-[92vh]');
    expect(modalContent.className).toContain('my-auto');
  });

  it('case 2: HomePage Inspect 360 modal opens with media viewer constrained to needed space', async () => {
    renderHomePageWithContext();

    await waitFor(() => {
      const inspectButtons = screen.getAllByText(/Inspect 360/i);
      expect(inspectButtons.length).toBeGreaterThan(0);
    });

    const inspectButtons = screen.getAllByText(/Inspect 360/i);
    fireEvent.click(inspectButtons[0]);

    // Verify inspect modal title is rendered
    expect(screen.getByText(/Certificate Details/i)).toBeInTheDocument();

    // Verify inspect modal container does not take 92vh full screen
    const certDetails = screen.getByText(/Certificate Details/i);
    const modalContent = certDetails.closest('.shadow-2xl');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent.className).toContain('max-h-[85vh]');
    expect(modalContent.className).not.toContain('max-h-[92vh]');
  });

  it('case 3: DeleteProductModal opens with compact, content-aware box styling', () => {
    const dummyDiamond = {
      id: 'fit-test-1',
      title: '1.20 Ct Emerald Lab Diamond',
      shape: 'Emerald',
      carat: '1.20 Ct'
    };

    render(
      <DeleteProductModal
        isOpen={true}
        diamond={dummyDiamond}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    const deleteModalContent = screen.getByTestId('delete-confirm-modal-content');
    expect(deleteModalContent).toBeInTheDocument();
    expect(deleteModalContent.className).toContain('max-w-md');
    expect(deleteModalContent.className).toContain('max-h-[85vh]');
    expect(deleteModalContent.className).toContain('my-auto');
  });

  it('case 4: ReviewModal renders content-based max height and centered margin', () => {
    render(
      <ReviewModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const reviewHeader = screen.getByText(/Submit Surat Loose Diamond Sourcing Review/i);
    const modalContent = reviewHeader.closest('.shadow-2xl');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent.className).toContain('max-h-[85vh]');
    expect(modalContent.className).not.toContain('max-h-[92vh]');
  });
});
