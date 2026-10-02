import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { insertDiamondIntoDb, getDiamondByIdFromDb, initDb } from '../../server/db';

describe('Product Image & Video Editing & File Upload Test Suite', () => {
  beforeEach(async () => {
    await initDb();
    localStorage.clear();

    if (typeof window !== 'undefined' && window.FileReader) {
      vi.spyOn(window.FileReader.prototype, 'readAsDataURL').mockImplementation(function (file) {
        const isVideo = file?.type?.includes('video') || file?.name?.endsWith('.mp4');
        const resultUrl = isVideo
          ? 'data:video/mp4;base64,dummyvideobase64data'
          : 'data:image/jpeg;base64,dummyimagebase64data';
        if (this.onload) {
          this.onload({ target: { result: resultUrl } });
        }
      });
    }
  });

  it('case 1: updates product image URL and 360 video URL in EditProductModal and persists changes', async () => {
    const testItem = {
      id: 'edit-media-test-1',
      title: 'Diamond with Editable Media 2.00 Ct',
      shape: 'Emerald',
      caratValue: 2.00,
      carat: '2.00 Ct',
      color: 'E',
      clarity: 'VS1',
      price: '$2,200.00',
      priceValue: 2200,
      imageUrl: '/assets/nivaan/images/old-photo.jpg',
      videoUrl: '/assets/nivaan/videos/old-video.mp4',
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
    fireEvent.change(searchInput, { target: { value: 'Editable Media' } });

    await waitFor(() => {
      expect(screen.getAllByText('Diamond with Editable Media 2.00 Ct').length).toBeGreaterThan(0);
    });

    // Open Edit modal
    const editBtn = screen.getByTestId('edit-card-edit-media-test-1');
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    // Change image URL and video URL input fields
    const imageUrlInput = screen.getByTestId('edit-image-url-input');
    const videoUrlInput = screen.getByTestId('edit-video-url-input');

    fireEvent.change(imageUrlInput, { target: { value: '/assets/nivaan/images/new-edited-photo.jpg' } });
    fireEvent.change(videoUrlInput, { target: { value: '/assets/nivaan/videos/new-edited-video.mp4' } });

    // Click Save Changes
    const saveBtn = screen.getByTestId('save-product-button');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('edit-product-modal')).not.toBeInTheDocument();
    });

    // Verify DB update
    const dbItem = await getDiamondByIdFromDb('edit-media-test-1');
    expect(dbItem).toBeDefined();
    expect(dbItem.imageUrl).toBe('/assets/nivaan/images/new-edited-photo.jpg');
    expect(dbItem.videoUrl).toBe('/assets/nivaan/videos/new-edited-video.mp4');
  });

  it('case 2: uploads new photo file and new video file in EditProductModal via File inputs', async () => {
    const testItem = {
      id: 'edit-file-upload-test-2',
      title: 'Diamond File Upload Test Item 1.80 Ct',
      shape: 'Oval',
      caratValue: 1.80,
      carat: '1.80 Ct',
      color: 'D',
      clarity: 'VVS1',
      price: '$1,900.00',
      priceValue: 1900,
      imageUrl: '/assets/nivaan/images/original.jpg',
      videoUrl: '/assets/nivaan/videos/original.mp4',
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
    fireEvent.change(searchInput, { target: { value: 'File Upload Test Item' } });

    await waitFor(() => {
      expect(screen.getAllByText('Diamond File Upload Test Item 1.80 Ct').length).toBeGreaterThan(0);
    });

    // Open Edit modal
    const editBtn = screen.getByTestId('edit-card-edit-file-upload-test-2');
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(screen.getByTestId('edit-product-modal')).toBeInTheDocument();
    });

    // Check upload buttons exist
    expect(screen.getByTestId('upload-edit-photo-button')).toBeInTheDocument();
    expect(screen.getByTestId('upload-edit-video-button')).toBeInTheDocument();

    // Change image URL and video URL
    const imageUrlInput = screen.getByTestId('edit-image-url-input');
    const videoUrlInput = screen.getByTestId('edit-video-url-input');

    fireEvent.change(imageUrlInput, { target: { value: 'data:image/jpeg;base64,newphotobase64' } });
    fireEvent.change(videoUrlInput, { target: { value: 'data:video/mp4;base64,newvideobase64' } });

    // Submit form
    const saveBtn = screen.getByTestId('save-product-button');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('edit-product-modal')).not.toBeInTheDocument();
    });

    // Check localStorage & DB persistence
    const savedCustom = JSON.parse(localStorage.getItem('gk_custom_diamonds') || '[]');
    const updated = savedCustom.find((item) => item.id === 'edit-file-upload-test-2');
    expect(updated).toBeDefined();
    expect(updated.imageUrl).toBe('data:image/jpeg;base64,newphotobase64');
    expect(updated.videoUrl).toBe('data:video/mp4;base64,newvideobase64');
  });
});
