import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider, useShop } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { AddProductModal } from '../components/AddProductModal';

const AddProductThemeTestHarness = () => {
  const { setThemeColor, themeColor, themeMode, setThemeMode } = useShop();

  return (
    <div>
      <div data-testid="active-color">{themeColor}</div>
      <div data-testid="active-mode">{themeMode}</div>
      <button onClick={() => setThemeColor('diamond-luxe')}>Set Diamond Luxe</button>
      <button onClick={() => setThemeColor('gold')}>Set Gold</button>
      <button onClick={() => setThemeMode('light')}>Set Light</button>
      <button onClick={() => setThemeMode('dark')}>Set Dark</button>

      <ProductsPage />
      <AddProductModal />
    </div>
  );
};

describe('+ Add Product Button Theme Adaptation Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme-color');
    window.scrollTo = vi.fn();
  });

  it('case 1: hero + Add Product button uses theme accent class and contains no hardcoded bg-gradient-to-r', () => {
    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const addBtns = screen.getAllByRole('button', { name: /Add Product/i });
    expect(addBtns.length).toBeGreaterThan(0);

    // Verify hero + Add Product button uses theme-accent bg-emerald-600 rather than hardcoded gradient
    const heroAddBtn = addBtns[0];
    expect(heroAddBtn.className).toContain('bg-emerald-600');
    expect(heroAddBtn.className).not.toContain('bg-gradient-to-r');
  });

  it('case 2: updates active theme color attribute across presets and opens AddProductModal', () => {
    const { getByText, getByTestId, getAllByRole } = render(
      <ShopProvider>
        <AddProductThemeTestHarness />
      </ShopProvider>
    );

    // Test Diamond Luxe Theme
    fireEvent.click(getByText('Set Diamond Luxe'));
    expect(getByTestId('active-color').textContent).toBe('diamond-luxe');
    expect(document.documentElement.getAttribute('data-theme-color')).toBe('diamond-luxe');

    // Test Gold Theme
    fireEvent.click(getByText('Set Gold'));
    expect(getByTestId('active-color').textContent).toBe('gold');
    expect(document.documentElement.getAttribute('data-theme-color')).toBe('gold');

    // Click + Add Product button under Gold theme
    const addBtns = getAllByRole('button', { name: /Add Product/i });
    fireEvent.click(addBtns[0]);

    // Verify AddProductModal opens
    expect(screen.getByText('Add & Import Certified Diamonds')).toBeInTheDocument();
  });
});
