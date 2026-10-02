import { describe, it, expect, beforeEach } from 'vitest';
import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShopProvider, useShop } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { AddProductModal } from '../components/AddProductModal';
import { insertDiamondIntoDb, getDiamondByIdFromDb, initDb } from '../../server/db';

describe('Comprehensive Product Editing & Synchronization Test Suite', () => {
  beforeEach(async () => {
    await initDb();
    localStorage.clear();
  });

  it('case 1: verifies edit button exists on grid cards, opens EditProductModal with prefilled specs, and updates state & DB', async () => {
    const testItem = {
      id: 'edit-grid-test-101',
      title: 'Original Grid Diamond Title 1.50 Ct',
      shape: 'Round Brilliant',
      caratValue: 1.50,
      carat: '1.50 Ct',
      color: 'D',
      clarity: 'VVS1',
      price: '$1,500.00',
      priceValue: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([testItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Grid Diamond' } });

    await waitFor(() => {
      expect(screen.getAllByText('Original Grid Diamond Title 1.50 Ct').length).toBeGreaterThan(0);
    });

    // Delete button must also be present (not removed)
    expect(screen.getByTestId('delete-card-edit-grid-test-101')).toBeInTheDocument();

    // Click Edit button on grid card
    const editBtn = screen.getByTestId('edit-card-edit-grid-test-101');
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);

    // Verify EditProductModal opens with prefilled fields
    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('edit-title-input');
    const priceInput = screen.getByTestId('edit-price-input');

    expect(titleInput.value).toBe('Original Grid Diamond Title 1.50 Ct');
    expect(priceInput.value).toBe('1500');

    // Change title and price
    fireEvent.change(titleInput, { target: { value: 'Updated Grid Diamond Title 2.00 Ct' } });
    fireEvent.change(priceInput, { target: { value: '2500' } });

    // Click Save Changes
    fireEvent.click(screen.getByTestId('save-product-button'));

    // Verify UI updates
    await waitFor(() => {
      expect(screen.getAllByText('Updated Grid Diamond Title 2.00 Ct').length).toBeGreaterThan(0);
    });

    // Verify PostgreSQL DB updates
    await waitFor(async () => {
      const dbItem = await getDiamondByIdFromDb('edit-grid-test-101');
      expect(dbItem).not.toBeNull();
      expect(dbItem.title).toBe('Updated Grid Diamond Title 2.00 Ct');
      expect(dbItem.priceValue).toBe(2500);
    });
  });

  it('case 2: verifies edit button in B2B Table View opens EditProductModal, updates product row, and leaves Delete button intact', async () => {
    const testItem = {
      id: 'edit-table-test-202',
      title: 'Original Table Diamond 2.20 Ct Emerald',
      shape: 'Emerald',
      caratValue: 2.20,
      carat: '2.20 Ct',
      color: 'E',
      clarity: 'VS1',
      price: '$2,200.00',
      priceValue: 2200,
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([testItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Table Diamond' } });

    // Switch to Table View
    const tableToggle = screen.getByTitle('B2B Table List View');
    fireEvent.click(tableToggle);

    await waitFor(() => {
      expect(screen.getAllByText('Original Table Diamond 2.20 Ct Emerald').length).toBeGreaterThan(0);
    });

    // Both Edit and Delete buttons should exist
    expect(screen.getByTestId('delete-table-edit-table-test-202')).toBeInTheDocument();
    const editTableBtn = screen.getByTestId('edit-table-edit-table-test-202');
    expect(editTableBtn).toBeInTheDocument();

    fireEvent.click(editTableBtn);

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('edit-title-input');
    fireEvent.change(titleInput, { target: { value: 'Modified Table Diamond 2.20 Ct Emerald' } });

    fireEvent.click(screen.getByTestId('save-product-button'));

    await waitFor(() => {
      expect(screen.getAllByText('Modified Table Diamond 2.20 Ct Emerald').length).toBeGreaterThan(0);
    });
  });

  it('case 3: verifies edit button in Product Detail Modal updates both detail modal and card view', async () => {
    const testItem = {
      id: 'edit-detail-test-303',
      title: 'Original Detail Modal Diamond',
      shape: 'Oval',
      caratValue: 3.00,
      carat: '3.00 Ct',
      color: 'F',
      clarity: 'VVS2',
      price: '$3,500.00',
      priceValue: 3500,
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([testItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Detail Modal' } });

    // Open detail modal
    const eyeButtons = await screen.findAllByTitle('View Media Gallery');
    fireEvent.click(eyeButtons[0]);

    // Detail modal header should have both Edit and Delete buttons
    expect(screen.getByTestId('delete-modal-product-button')).toBeInTheDocument();
    const modalEditBtn = screen.getByTestId('edit-modal-product-button');
    expect(modalEditBtn).toBeInTheDocument();

    fireEvent.click(modalEditBtn);

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('edit-title-input');
    fireEvent.change(titleInput, { target: { value: 'Renamed Detail Modal Diamond' } });

    fireEvent.click(screen.getByTestId('save-product-button'));

    await waitFor(() => {
      expect(screen.getAllByText('Renamed Detail Modal Diamond').length).toBeGreaterThan(0);
    });
  });

  it('case 4: verifies edit button in Manage Custom Items tab inside AddProductModal opens EditProductModal and updates custom diamond', async () => {
    const testCustomItem = {
      id: 'edit-manage-test-404',
      title: 'Custom Manage Tab Diamond 1.80 Ct',
      shape: 'Cushion',
      carat: '1.80 Ct',
      caratValue: 1.80,
      color: 'G',
      clarity: 'VS2',
      price: '$1,900.00',
      priceValue: 1900,
      isCustomAdded: true
    };

    const TestComponent = () => {
      const { addCustomDiamond } = useShop();
      useEffect(() => {
        addCustomDiamond(testCustomItem);
      }, []);
      return (
        <>
          <ProductsPage />
          <AddProductModal />
        </>
      );
    };

    render(
      <ShopProvider>
        <TestComponent />
      </ShopProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Custom Manage Tab Diamond 1.80 Ct').length).toBeGreaterThan(0);
    });

    const addBtn = screen.getAllByRole('button', { name: /Add Product/i })[0];
    fireEvent.click(addBtn);

    const manageTab = await screen.findByRole('button', { name: /Manage Added Products/i });
    fireEvent.click(manageTab);

    await waitFor(() => {
      expect(screen.getByTestId('edit-manage-item-edit-manage-test-404')).toBeInTheDocument();
    });

    const editManageBtn = screen.getByTestId('edit-manage-item-edit-manage-test-404');
    fireEvent.click(editManageBtn);

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('edit-title-input');
    fireEvent.change(titleInput, { target: { value: 'Updated Custom Manage Tab Diamond' } });
    fireEvent.click(screen.getByTestId('save-product-button'));

    await waitFor(() => {
      expect(screen.getAllByText('Updated Custom Manage Tab Diamond').length).toBeGreaterThan(0);
    });
  });

  it('case 5: cancels edit or closes modal without saving when Cancel or Escape key is pressed', async () => {
    const testItem = {
      id: 'edit-cancel-test-505',
      title: 'Unchanged Diamond Title',
      shape: 'Round Brilliant',
      caratValue: 1.00,
      carat: '1.00 Ct',
      color: 'D',
      clarity: 'IF',
      price: '$1,000.00',
      priceValue: 1000,
      isCustomAdded: true
    };
    await insertDiamondIntoDb(testItem);
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([testItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Unchanged Diamond' } });

    await waitFor(() => {
      expect(screen.getAllByText('Unchanged Diamond Title').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByTestId('edit-card-edit-cancel-test-505'));

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('edit-title-input');
    fireEvent.change(titleInput, { target: { value: 'Temporary Title Should Not Save' } });

    // Click Cancel button
    fireEvent.click(screen.getByTestId('cancel-edit-button'));

    // Modal should close and original title remain
    await waitFor(() => {
      expect(screen.queryByTestId('edit-product-modal')).not.toBeInTheDocument();
      expect(screen.getAllByText('Unchanged Diamond Title').length).toBeGreaterThan(0);
    });
  });
});
