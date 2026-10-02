import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { HomePage } from '../pages/HomePage';

describe('HomePage Dynamic Inventory Count Button Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('case 1: displays "View Full 0 Inventory" when inventory is empty', () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([]));

    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    const button = screen.getByTestId('view-inventory-button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toMatch(/View Full 0 Inventory/i);
  });

  it('case 2: dynamically displays exact count "View Full 2+ Inventory" when 2 diamonds are present in inventory', () => {
    const mockInventory = [
      { id: 'inv-1', title: '1.00 Carat Round Diamond', shape: 'Round', carat: 1.0, price: '$1,000' },
      { id: 'inv-2', title: '2.00 Carat Oval Diamond', shape: 'Oval', carat: 2.0, price: '$2,500' }
    ];
    localStorage.setItem('gk_custom_diamonds', JSON.stringify(mockInventory));

    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    const button = screen.getByTestId('view-inventory-button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toMatch(/View Full 2\+ Inventory/i);
  });

  it('case 3: dynamically displays formatted count "View Full 5,432+ Inventory" for large datasets', () => {
    const largeInventory = Array.from({ length: 5432 }, (_, i) => ({
      id: `inv-large-${i}`,
      title: `Diamond #${i}`,
      shape: 'Round',
      carat: 1.0,
      price: '$1,000'
    }));
    localStorage.setItem('gk_custom_diamonds', JSON.stringify(largeInventory));

    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    const button = screen.getByTestId('view-inventory-button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toMatch(/View Full 5,432\+ Inventory/i);
  });

  it('case 4: clicking button navigates user to video catalog products page', () => {
    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    const button = screen.getByTestId('view-inventory-button');
    fireEvent.click(button);
    expect(window.location.pathname + window.location.search).toBe('/products?media=video');
  });
});
