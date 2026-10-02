import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { insertDiamondIntoDb, getDiamondByIdFromDb, initDb, deleteDiamondFromDb } from '../../server/db';

describe('Comprehensive Product Deletion & PostgreSQL Synchronization Test Suite', () => {
  beforeEach(async () => {
    await initDb();
    localStorage.clear();
  });

  it('case 1: verifies delete diamond option exists on grid cards and removes product from state and database', async () => {
    const testItem = {
      id: 'del-grid-test-101',
      title: 'Delete Test Grid Diamond 1.75 Ct',
      shape: 'Round Brilliant',
      caratValue: 1.75,
      carat: '1.75 Ct',
      color: 'D',
      clarity: 'VVS1',
      price: '$1,800.00',
      priceValue: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Delete Test Grid' } });

    // Verify item is initially visible
    await waitFor(() => {
      expect(screen.getByText('Delete Test Grid Diamond 1.75 Ct')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTestId('delete-card-del-grid-test-101');
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);

    // Confirm deletion in DeleteProductModal
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-modal-button')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('confirm-delete-modal-button'));

    // Verify item is removed from UI
    await waitFor(() => {
      expect(screen.queryByText('Delete Test Grid Diamond 1.75 Ct')).not.toBeInTheDocument();
    });

    // Verify item is deleted from PostgreSQL DB
    await waitFor(async () => {
      const dbItem = await getDiamondByIdFromDb('del-grid-test-101');
      expect(dbItem).toBeNull();
    });
  });

  it('case 2: verifies delete option in B2B Table View removes product row and updates database', async () => {
    const testItem = {
      id: 'del-table-test-202',
      title: 'Table View Delete Test 2.50 Ct Emerald',
      shape: 'Emerald',
      caratValue: 2.50,
      carat: '2.50 Ct',
      color: 'E',
      clarity: 'VS1',
      price: '$2,400.00',
      priceValue: 2400,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Table View Delete Test' } });

    // Switch to Table View
    const tableToggle = screen.getByTitle('B2B Table List View');
    fireEvent.click(tableToggle);

    await waitFor(() => {
      expect(screen.getByText('Table View Delete Test 2.50 Ct Emerald')).toBeInTheDocument();
    });

    const deleteTableBtn = screen.getByTestId('delete-table-del-table-test-202');
    expect(deleteTableBtn).toBeInTheDocument();

    fireEvent.click(deleteTableBtn);

    // Confirm deletion in DeleteProductModal
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-modal-button')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('confirm-delete-modal-button'));

    await waitFor(() => {
      expect(screen.queryByText('Table View Delete Test 2.50 Ct Emerald')).not.toBeInTheDocument();
    });

    await waitFor(async () => {
      const dbItem = await getDiamondByIdFromDb('del-table-test-202');
      expect(dbItem).toBeNull();
    });
  });

  it('case 3: verifies delete option inside Modal Viewer closes modal and removes product from database', async () => {
    const testItem = {
      id: 'del-modal-test-303',
      title: 'Modal Delete Test 3.00 Ct Cushion',
      shape: 'Cushion',
      caratValue: 3.00,
      carat: '3.00 Ct',
      color: 'F',
      clarity: 'IF',
      price: '$4,200.00',
      priceValue: 4200,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Modal Delete Test' } });

    await waitFor(() => {
      expect(screen.getByText('Modal Delete Test 3.00 Ct Cushion')).toBeInTheDocument();
    });

    // Open modal by clicking title
    fireEvent.click(screen.getByText('Modal Delete Test 3.00 Ct Cushion'));

    // Verify modal open with Delete button inside
    await waitFor(() => {
      expect(screen.getByTestId('delete-modal-product-button')).toBeInTheDocument();
    });

    const modalDeleteBtn = screen.getByTestId('delete-modal-product-button');
    fireEvent.click(modalDeleteBtn);

    // Confirm deletion in DeleteProductModal
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-modal-button')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('confirm-delete-modal-button'));

    // Verify modal closed and item removed
    await waitFor(() => {
      expect(screen.queryByTestId('delete-modal-product-button')).not.toBeInTheDocument();
      expect(screen.queryByText('Modal Delete Test 3.00 Ct Cushion')).not.toBeInTheDocument();
    });

    await waitFor(async () => {
      const dbItem = await getDiamondByIdFromDb('del-modal-test-303');
      expect(dbItem).toBeNull();
    });
  });

  it('case 4: tests direct DB deletion service deleteDiamondFromDb(id) against PostgreSQL database', async () => {
    const testItem = {
      id: 'del-api-test-404',
      title: 'API Direct Delete Test Product',
      shape: 'Pear',
      caratValue: 1.20,
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);

    let dbItem = await getDiamondByIdFromDb('del-api-test-404');
    expect(dbItem).not.toBeNull();

    await deleteDiamondFromDb('del-api-test-404');

    dbItem = await getDiamondByIdFromDb('del-api-test-404');
    expect(dbItem).toBeNull();
  });

  it('case 5: opens delete confirmation modal and cancels deletion when Cancel is clicked', async () => {
    const testItem = {
      id: 'del-cancel-test-505',
      title: 'Delete Test Cancel Diamond 2.00 Ct',
      shape: 'Radiant',
      caratValue: 2.00,
      carat: '2.00 Ct',
      color: 'E',
      clarity: 'VVS2',
      price: '$2,100.00',
      priceValue: 2100,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Delete Test Cancel' } });

    await waitFor(() => {
      expect(screen.getByText('Delete Test Cancel Diamond 2.00 Ct')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTestId('delete-card-del-cancel-test-505');
    fireEvent.click(deleteBtn);

    // Verify DeleteProductModal is displayed
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-modal-button')).toBeInTheDocument();
    });

    // Click Cancel
    fireEvent.click(screen.getByTestId('cancel-delete-modal-button'));

    // Verify item is STILL present in UI
    expect(screen.getByText('Delete Test Cancel Diamond 2.00 Ct')).toBeInTheDocument();

    // Verify item is STILL in DB
    const dbItem = await getDiamondByIdFromDb('del-cancel-test-505');
    expect(dbItem).not.toBeNull();
  });
});
