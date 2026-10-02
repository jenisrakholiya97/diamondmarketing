import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';

const renderProductsPage = () => {
  return render(
    <ShopProvider>
      <ProductsPage />
    </ShopProvider>
  );
};

describe('Products Page Reset Filters Button Disabled/Enabled State Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('case 1: Reset Filters button is disabled by default on page load when no filters are changed', () => {
    renderProductsPage();

    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toBeDisabled();
  });

  it('case 2: Reset Filters button becomes enabled when search input text is typed', () => {
    renderProductsPage();

    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    expect(resetButton).toBeDisabled();

    const searchInput = screen.getByPlaceholderText(/Search title, carat/i);
    fireEvent.change(searchInput, { target: { value: 'Oval' } });

    expect(resetButton).toBeEnabled();
  });

  it('case 3: Reset Filters button becomes enabled when shape filter tab is selected', () => {
    renderProductsPage();

    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    expect(resetButton).toBeDisabled();

    const ovalShapeBtn = screen.getByRole('button', { name: /Oval/i });
    fireEvent.click(ovalShapeBtn);

    expect(resetButton).toBeEnabled();
  });

  it('case 4: Clicking enabled Reset Filters button resets all state and disables the button again', () => {
    renderProductsPage();

    const resetButton = screen.getByRole('button', { name: /Reset Filters/i });
    expect(resetButton).toBeDisabled();

    const searchInput = screen.getByPlaceholderText(/Search title, carat/i);
    fireEvent.change(searchInput, { target: { value: 'IGI-9999' } });
    expect(resetButton).toBeEnabled();

    // Click Reset Filters
    fireEvent.click(resetButton);

    // Filter should reset and button should be disabled again
    expect(searchInput.value).toBe('');
    expect(resetButton).toBeDisabled();
  });
});
