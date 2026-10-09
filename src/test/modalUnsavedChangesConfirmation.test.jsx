import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { AddProductModal } from '../components/AddProductModal';
import { EditProductModal } from '../components/EditProductModal';

describe('Modal Unsaved Changes Custom Confirmation Modal Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('AddProductModal Custom Unsaved Changes Modal', () => {
    const renderAddProductModal = () => {
      return render(
        <ShopProvider>
          <ProductsPage />
          <AddProductModal />
        </ShopProvider>
      );
    };

    it('case 1: closes AddProductModal immediately without custom confirmation modal if NO field is changed', async () => {
      renderAddProductModal();

      // Open AddProductModal
      fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);
      expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();

      // Click outside backdrop
      const backdrop = screen.getByText(/Add & Import Certified Diamonds/i).closest('.modal-backdrop-overlay');
      expect(backdrop).toBeInTheDocument();
      fireEvent.click(backdrop);

      // Modal closes immediately, confirmation modal is NOT shown
      expect(screen.queryByTestId('unsaved-changes-modal-overlay')).not.toBeInTheDocument();
      expect(screen.queryByText(/Add & Import Certified Diamonds/i)).not.toBeInTheDocument();
    });

    it('case 2: opens custom UnsavedChangesModal when clicking outside AddProductModal after modifying a text field', async () => {
      renderAddProductModal();

      // Open AddProductModal
      fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);

      // Modify title input
      const titleInput = screen.getByPlaceholderText(/2.50 Carat Oval IGI Certified/i);
      fireEvent.change(titleInput, { target: { value: 'Dirty Diamond Title' } });

      // Click outside backdrop
      const backdrop = screen.getByText(/Add & Import Certified Diamonds/i).closest('.modal-backdrop-overlay');
      fireEvent.click(backdrop);

      // Custom UnsavedChangesModal MUST BE OPEN
      expect(screen.getByTestId('unsaved-changes-modal-overlay')).toBeInTheDocument();
      expect(screen.getByText(/Unsaved Changes Detected/i)).toBeInTheDocument();

      // Click "Keep Editing" button
      const keepEditingBtn = screen.getByTestId('keep-editing-button');
      fireEvent.click(keepEditingBtn);

      // UnsavedChangesModal closes, AddProductModal stays open
      expect(screen.queryByTestId('unsaved-changes-modal-overlay')).not.toBeInTheDocument();
      expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();

      // Click outside backdrop again
      fireEvent.click(backdrop);
      expect(screen.getByTestId('unsaved-changes-modal-overlay')).toBeInTheDocument();

      // Click "Discard Changes & Exit" button
      const discardBtn = screen.getByTestId('discard-changes-button');
      fireEvent.click(discardBtn);

      // AddProductModal MUST NOW BE CLOSED
      expect(screen.queryByText(/Add & Import Certified Diamonds/i)).not.toBeInTheDocument();
    });

    it('case 3: opens custom UnsavedChangesModal when pressing Close (X) button after photo upload', async () => {
      renderAddProductModal();

      // Open AddProductModal
      fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);

      // Upload photo file
      const photoInput = screen.getByTestId('photo-file-input');
      const photoFile = new File(['photo data'], 'dirty_photo.jpg', { type: 'image/jpeg' });
      fireEvent.change(photoInput, { target: { files: [photoFile] } });

      // Click Close (X) button
      const closeBtn = screen.getByLabelText(/Close add product modal/i);
      fireEvent.click(closeBtn);

      // Custom confirmation modal opens
      expect(screen.getByTestId('unsaved-changes-modal-overlay')).toBeInTheDocument();

      // Confirm Discard
      fireEvent.click(screen.getByTestId('discard-changes-button'));
      expect(screen.queryByText(/Add & Import Certified Diamonds/i)).not.toBeInTheDocument();
    });
  });

  describe('EditProductModal Custom Unsaved Changes Modal', () => {
    const mockDiamond = {
      id: 'edit-dirty-custom-101',
      title: 'Original Diamond 1.50 Ct',
      shape: 'Round Brilliant',
      caratValue: 1.50,
      carat: '1.50 Ct',
      color: 'D',
      clarity: 'VVS1',
      price: '$1,500.00',
      priceValue: 1500,
      imageUrl: '/images/orig.jpg',
      isCustomAdded: true
    };

    it('case 4: closes EditProductModal immediately without custom confirmation modal if NO field is changed', () => {
      const handleClose = vi.fn();
      const handleSave = vi.fn();

      render(
        <EditProductModal
          isOpen={true}
          diamond={mockDiamond}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      // Click outside overlay
      const overlay = screen.getByTestId('edit-product-modal-overlay');
      fireEvent.click(overlay);

      expect(screen.queryByTestId('unsaved-changes-modal-overlay')).not.toBeInTheDocument();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('case 5: opens custom UnsavedChangesModal when clicking outside overlay in EditProductModal after field change', () => {
      const handleClose = vi.fn();
      const handleSave = vi.fn();

      render(
        <EditProductModal
          isOpen={true}
          diamond={mockDiamond}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      // Edit title field
      const titleInput = screen.getByDisplayValue('Original Diamond 1.50 Ct');
      fireEvent.change(titleInput, { target: { value: 'Modified Diamond Title' } });

      // Click outside overlay
      const overlay = screen.getByTestId('edit-product-modal-overlay');
      fireEvent.click(overlay);

      // Custom UnsavedChangesModal opens
      expect(screen.getByTestId('unsaved-changes-modal-overlay')).toBeInTheDocument();
      expect(handleClose).not.toHaveBeenCalled();

      // Click "Keep Editing"
      fireEvent.click(screen.getByTestId('keep-editing-button'));
      expect(screen.queryByTestId('unsaved-changes-modal-overlay')).not.toBeInTheDocument();
      expect(handleClose).not.toHaveBeenCalled();

      // Click outside overlay again and click "Discard Changes & Exit"
      fireEvent.click(overlay);
      fireEvent.click(screen.getByTestId('discard-changes-button'));

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('case 6: opens custom UnsavedChangesModal when clicking Cancel button in EditProductModal after photo change', () => {
      const handleClose = vi.fn();
      const handleSave = vi.fn();

      render(
        <EditProductModal
          isOpen={true}
          diamond={mockDiamond}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      // Upload new photo file
      const photoInput = screen.getByTestId('edit-photo-file-input');
      const photoFile = new File(['new image data'], 'edited.jpg', { type: 'image/jpeg' });
      fireEvent.change(photoInput, { target: { files: [photoFile] } });

      // Click Cancel button
      const cancelBtn = screen.getByTestId('cancel-edit-button');
      fireEvent.click(cancelBtn);

      // Confirmation modal opens
      expect(screen.getByTestId('unsaved-changes-modal-overlay')).toBeInTheDocument();
      expect(handleClose).not.toHaveBeenCalled();

      // Click "Discard Changes & Exit"
      fireEvent.click(screen.getByTestId('discard-changes-button'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('case 7: saves changes in EditProductModal without opening custom confirmation modal when clicking Save', () => {
      const handleClose = vi.fn();
      const handleSave = vi.fn();

      render(
        <EditProductModal
          isOpen={true}
          diamond={mockDiamond}
          onClose={handleClose}
          onSave={handleSave}
        />
      );

      // Change price field
      const priceInput = screen.getByDisplayValue('1500');
      fireEvent.change(priceInput, { target: { value: '1800' } });

      // Click Save Changes button
      const saveBtn = screen.getByTestId('save-product-button');
      fireEvent.click(saveBtn);

      expect(screen.queryByTestId('unsaved-changes-modal-overlay')).not.toBeInTheDocument();
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave.mock.calls[0][0].priceValue).toBe(1800);
    });
  });
});
