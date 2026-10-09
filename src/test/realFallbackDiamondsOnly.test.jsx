import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import fallbackDiamondsData from '../../server/data/fallback_diamonds.json';
import { saveToIndexedDB, loadFromIndexedDB } from '../utils/indexedDBStorage';

describe('Strict Server Fallback Diamonds Only in Products Tab Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Case 1: server/data/fallback_diamonds.json contains valid uploaded diamonds with complete schema', () => {
    expect(Array.isArray(fallbackDiamondsData)).toBe(true);
    expect(fallbackDiamondsData.length).toBeGreaterThanOrEqual(3);

    const ids = fallbackDiamondsData.map((d) => d.id);
    expect(ids).toContain('custom-1791451187213-393');
    expect(ids).toContain('custom-1791451120390-868');
    expect(ids).toContain('custom-1791443540837-674');

    // Verify deleted diamond custom-1791362707186-948 is NOT in fallback_diamonds.json
    expect(ids).not.toContain('custom-1791362707186-948');

    fallbackDiamondsData.forEach((d) => {
      expect(d.title).toBeTruthy();
      expect(d.shape).toBe('Round Brilliant');
      expect(d.caratValue).toBe(1.5);
      expect(d.color).toBe('D');
      expect(d.clarity).toBe('VVS1');
      expect(d.price).toBeTruthy();
      expect(d.imageUrl || d.image).toBeTruthy();
      expect(d.videoUrl || d.video).toBeTruthy();
      expect(d.certNumber).toBeTruthy();
    });
  });

  it('Case 2: Products tab renders only the diamonds present in server/data/fallback_diamonds.json', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify(fallbackDiamondsData));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Verify all 3 cards from fallback_diamonds.json are rendered
    expect(screen.getByTestId('delete-card-custom-1791451187213-393')).toBeInTheDocument();
    expect(screen.getByTestId('delete-card-custom-1791451120390-868')).toBeInTheDocument();
    expect(screen.getByTestId('delete-card-custom-1791443540837-674')).toBeInTheDocument();

    expect(screen.getByTestId('edit-card-custom-1791451187213-393')).toBeInTheDocument();
    expect(screen.getByTestId('edit-card-custom-1791451120390-868')).toBeInTheDocument();
    expect(screen.getByTestId('edit-card-custom-1791443540837-674')).toBeInTheDocument();

    // Verify wholesale prices are rendered
    expect(screen.getAllByText('$1,500.00').length).toBeGreaterThan(0);
    expect(screen.getByText('$1,570.00')).toBeInTheDocument();

    // Verify the grid displays the products
    const productTitles = screen.getAllByText(/1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond/i);
    expect(productTitles.length).toBeGreaterThanOrEqual(3);
  });

  it('Case 3: Stale/deleted diamond (custom-1791362707186-948) in localStorage is forcefully excluded', async () => {
    const staleDiamond = {
      id: 'custom-1791362707186-948',
      title: 'Stale Deleted Diamond 1.50 Ct',
      shape: 'Round Brilliant',
      caratValue: 1.5,
      carat: '1.50 Ct',
      color: 'D',
      clarity: 'VVS1',
      price: '$1,500.00',
      certNumber: 'CERT-STALE-948',
      isCustomAdded: true,
      imageUrl: '/assets/stale.jpg'
    };

    // Stale item placed into localStorage alongside fallback items
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([staleDiamond, ...fallbackDiamondsData]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Stale deleted item must NEVER appear in products tab
    expect(screen.queryByTestId('delete-card-custom-1791362707186-948')).not.toBeInTheDocument();
    expect(screen.queryByText(/Stale Deleted Diamond/i)).not.toBeInTheDocument();

    // Valid items must be present
    expect(screen.getByTestId('delete-card-custom-1791451187213-393')).toBeInTheDocument();
    expect(screen.getByTestId('delete-card-custom-1791451120390-868')).toBeInTheDocument();
    expect(screen.getByTestId('delete-card-custom-1791443540837-674')).toBeInTheDocument();
  });

  it('Case 4: Fake stock diamonds are forcefully excluded from products tab', async () => {
    const fakeDiamond = {
      id: 'fake-stock-999',
      title: 'Fake Mock Stock Diamond',
      shape: 'Round Brilliant',
      caratValue: 1.5,
      color: 'D',
      clarity: 'VVS1',
      price: '$999.00',
      certNumber: 'CERT-FAKE-999',
      isFake: true,
      isCustomAdded: false
    };

    localStorage.setItem('gk_custom_diamonds', JSON.stringify([...fallbackDiamondsData, fakeDiamond]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    expect(screen.queryByTestId('delete-card-fake-stock-999')).not.toBeInTheDocument();
    expect(screen.queryByText(/Fake Mock Stock Diamond/i)).not.toBeInTheDocument();
  });

  it('Case 5: Searching by certificate number isolates the exact diamond from server/data/fallback_diamonds.json', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify(fallbackDiamondsData));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);

    // Search for first cert CERT-77440695 (custom-1791451187213-393)
    fireEvent.change(searchInput, { target: { value: 'CERT-77440695' } });
    expect(screen.getByTestId('delete-card-custom-1791451187213-393')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-card-custom-1791451120390-868')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-card-custom-1791443540837-674')).not.toBeInTheDocument();

    // Search for second cert CERT-71179422 (custom-1791451120390-868)
    fireEvent.change(searchInput, { target: { value: 'CERT-71179422' } });
    expect(screen.getByTestId('delete-card-custom-1791451120390-868')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-card-custom-1791451187213-393')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-card-custom-1791443540837-674')).not.toBeInTheDocument();

    // Search for non-existent cert
    fireEvent.change(searchInput, { target: { value: 'CERT-NONEXISTENT' } });
    expect(screen.getByText(/No Products Match Your Criteria/i)).toBeInTheDocument();
  });

  it('Case 6: Filter controls work exclusively on fallback_diamonds.json catalog', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify(fallbackDiamondsData));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Shape: Round Brilliant (all 3 match)
    const roundBtn = screen.getByRole('button', { name: /^Round$/i });
    fireEvent.click(roundBtn);
    expect(screen.getByTestId('delete-card-custom-1791451187213-393')).toBeInTheDocument();
    expect(screen.getByTestId('delete-card-custom-1791451120390-868')).toBeInTheDocument();
    expect(screen.getByTestId('delete-card-custom-1791443540837-674')).toBeInTheDocument();

    // Shape: Emerald (0 match, displays empty state)
    const emeraldBtn = screen.getByRole('button', { name: /^Emerald$/i });
    fireEvent.click(emeraldBtn);
    expect(screen.getByText(/No Products Match Your Criteria/i)).toBeInTheDocument();
  });

  it('Case 7: IndexedDB storage clears deleted items on save to prevent resurrecting removed diamonds', async () => {
    const staleDiamond = {
      id: 'custom-1791362707186-948',
      title: 'Old Deleted Item'
    };

    // Save list with stale diamond
    await saveToIndexedDB([staleDiamond, ...fallbackDiamondsData]);
    let stored = await loadFromIndexedDB();
    expect(stored.some((d) => d.id === 'custom-1791362707186-948')).toBe(true);

    // Save sanitized list without stale diamond
    await saveToIndexedDB(fallbackDiamondsData);
    stored = await loadFromIndexedDB();
    expect(stored.some((d) => d.id === 'custom-1791362707186-948')).toBe(false);
    expect(stored.length).toBe(fallbackDiamondsData.length);
  });
});
