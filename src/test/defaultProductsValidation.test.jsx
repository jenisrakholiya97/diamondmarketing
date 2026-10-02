import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShopProvider, useShop } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { CATALOG_DIAMONDS } from '../data/catalogData';
import { initDb } from '../../server/db';

const CustomTestComponent = () => {
  const { diamonds, addCustomDiamond, deleteDiamond } = useShop();
  return (
    <div>
      <div data-testid="count">{diamonds.length}</div>
      <button
        data-testid="add-item"
        onClick={() =>
          addCustomDiamond({
            id: 'test-custom-99',
            title: 'User Uploaded Test Diamond 2.00 Ct',
            shape: 'Round Brilliant',
            caratValue: 2.00,
            price: '$2,000.00',
            isCustomAdded: true
          })
        }
      >
        Add Custom Item
      </button>
      <button data-testid="del-item" onClick={() => deleteDiamond('test-custom-99')}>
        Delete Custom Item
      </button>
      {diamonds.map((d) => (
        <div key={d.id}>{d.title}</div>
      ))}
    </div>
  );
};

describe('Zero Default Products & User Uploaded Items Test Suite', () => {
  beforeEach(async () => {
    await initDb();
    localStorage.clear();
  });

  it('case 1: verifies default CATALOG_DIAMONDS dataset is empty (0 default products)', () => {
    expect(CATALOG_DIAMONDS.length).toBe(0);
  });

  it('case 2: verifies platform starts with 0 default products and displays empty state message', async () => {
    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No Products Match Your Criteria/i)).toBeInTheDocument();
    });
  });

  it('case 3: verifies user-added custom diamonds can be dynamically added and deleted', async () => {
    render(
      <ShopProvider>
        <CustomTestComponent />
      </ShopProvider>
    );

    expect(screen.getByTestId('count').textContent).toBe('0');

    fireEvent.click(screen.getByTestId('add-item'));

    await waitFor(() => {
      expect(screen.getByText('User Uploaded Test Diamond 2.00 Ct')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('del-item'));

    await waitFor(() => {
      expect(screen.queryByText('User Uploaded Test Diamond 2.00 Ct')).not.toBeInTheDocument();
    });
  });
});
