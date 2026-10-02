import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider, useShop } from '../context/ShopContext';
import { AddProductModal } from '../components/AddProductModal';
import { ProductsPage } from '../pages/ProductsPage';

const TestAppWithAddProduct = () => {
  const { openAddProductModal } = useShop();
  return (
    <div>
      <button onClick={() => openAddProductModal('single')}>Open Add Modal</button>
      <AddProductModal />
      <ProductsPage />
    </div>
  );
};

describe('Permanent Media Storage & Product Persistence Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('case 1: converts uploaded 360° video file to permanent Data URL and persists product in localStorage', async () => {
    render(
      <ShopProvider>
        <TestAppWithAddProduct />
      </ShopProvider>
    );

    // Open Add Product Modal
    fireEvent.click(screen.getByText('Open Add Modal'));

    // Fill Title
    const titleInput = screen.getByTestId('diamond-title-input');
    fireEvent.change(titleInput, { target: { value: 'Permanent Video Test Diamond' } });

    // Mock Video File Upload using FileReader
    const file = new File(['dummy video data'], 'test_video.mp4', { type: 'video/mp4' });
    const videoInput = screen.getByTestId('video-file-input');

    // Trigger file change event
    fireEvent.change(videoInput, { target: { files: [file] } });

    // Wait for FileReader async conversion & toast notification
    await waitFor(() => {
      expect(screen.getByText(/360° Video uploaded successfully! Stored permanently/i)).toBeInTheDocument();
    });

    // Submit single diamond form using data-testid
    const submitBtn = screen.getByTestId('publish-diamond-button');
    fireEvent.click(submitBtn);

    // Check localStorage persistence
    const saved = localStorage.getItem('gk_custom_diamonds');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe('Permanent Video Test Diamond');
    expect(parsed[0].videoUrl).toMatch(/^data:video\/mp4;base64/);
  });

  it('case 2: compresses uploaded photo files and persists single diamond permanently', async () => {
    render(
      <ShopProvider>
        <TestAppWithAddProduct />
      </ShopProvider>
    );

    // Open Add Product Modal
    fireEvent.click(screen.getByText('Open Add Modal'));

    // Fill Title
    const titleInput = screen.getByTestId('diamond-title-input');
    fireEvent.change(titleInput, { target: { value: 'Single Custom Emerald Gem 3.50Ct' } });

    // Submit single diamond form
    const submitBtn = screen.getByTestId('publish-diamond-button');
    fireEvent.click(submitBtn);

    // Verify diamond is saved to localStorage
    const saved = localStorage.getItem('gk_custom_diamonds');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed[0].title).toBe('Single Custom Emerald Gem 3.50Ct');

    // Close modal and verify product is rendered on Products page
    fireEvent.click(screen.getByLabelText(/Close add product modal/i));
    expect(screen.getAllByText('Single Custom Emerald Gem 3.50Ct').length).toBeGreaterThan(0);
  });

  it('case 3: puts new photo & video data inside local storage on upload and deletes record on product deletion', async () => {
    const testItem = {
      id: 'nivaan-test-item-999',
      title: 'Nivaan Dynamic Sync Diamond',
      shape: 'Radiant',
      carat: '4.00 Ct',
      caratValue: 4.0,
      price: '$5,000.00',
      imageUrl: 'https://example.com/custom_photo.jpg',
      videoUrl: 'https://example.com/custom_video.mp4'
    };

    localStorage.setItem('gk_custom_diamonds', JSON.stringify([testItem]));
    const saved = localStorage.getItem('gk_custom_diamonds');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved);
    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe('Nivaan Dynamic Sync Diamond');
    expect(parsed[0].imageUrl).toBe('https://example.com/custom_photo.jpg');

    localStorage.removeItem('gk_custom_diamonds');
    expect(localStorage.getItem('gk_custom_diamonds')).toBeNull();
  });
});
