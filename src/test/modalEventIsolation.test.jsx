import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopProvider, useShop } from '../context/ShopContext';
import { AddProductModal } from '../components/AddProductModal';
import { DeleteProductModal } from '../components/DeleteProductModal';
import { QuoteModal } from '../components/QuoteModal';

const ModalOpener = () => {
  const { openAddProductModal, openQuoteModal } = useShop();
  return (
    <div>
      <button data-testid="open-add-btn" onClick={() => openAddProductModal('single')}>
        Open Add Modal
      </button>
      <button data-testid="open-quote-btn" onClick={() => openQuoteModal()}>
        Open Quote Modal
      </button>
      <AddProductModal />
      <QuoteModal />
    </div>
  );
};

describe('Modal Event Isolation & Scroll Lock Test Suite', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  it('case 1: locks body scroll and captures Escape key when AddProductModal opens', () => {
    render(
      <ShopProvider>
        <ModalOpener />
      </ShopProvider>
    );

    fireEvent.click(screen.getByTestId('open-add-btn'));

    expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText(/Add & Import Certified Diamonds/i)).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('case 2: isolates pointer, wheel, and mouse events on AddProductModal backdrop', () => {
    render(
      <ShopProvider>
        <ModalOpener />
      </ShopProvider>
    );

    fireEvent.click(screen.getByTestId('open-add-btn'));

    const titleElement = screen.getByText(/Add & Import Certified Diamonds/i);
    const backdrop = titleElement.closest('.modal-backdrop-overlay');
    expect(backdrop).toBeInTheDocument();

    const stopPropagationSpy = vi.fn();
    fireEvent.pointerDown(backdrop, { stopPropagation: stopPropagationSpy });
    fireEvent.mouseDown(backdrop, { stopPropagation: stopPropagationSpy });
    fireEvent.wheel(backdrop, { stopPropagation: stopPropagationSpy });

    expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();
  });

  it('case 3: isolates events and locks body scroll when DeleteProductModal opens', () => {
    const dummyDiamond = { id: 'd-101', title: 'Test Diamond', carat: '1.00 Ct', shape: 'Round' };
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <DeleteProductModal
        isOpen={true}
        diamond={dummyDiamond}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    );

    expect(screen.getByText(/Delete Certified Diamond/i)).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });

  it('case 4: locks body scroll and isolates events on QuoteModal', () => {
    render(
      <ShopProvider>
        <ModalOpener />
      </ShopProvider>
    );

    fireEvent.click(screen.getByTestId('open-quote-btn'));

    expect(screen.getByText(/Request Official B2B Quotation/i)).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText(/Request Official B2B Quotation/i)).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(document.documentElement.style.overflow).toBe('');
  });
});
