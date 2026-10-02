import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage, ProductCardImage, TableProductImage } from '../pages/ProductsPage';
import { HomePage } from '../pages/HomePage';
import { saveDbDiamondsToIndexedDB, loadDbDiamondsFromIndexedDB } from '../utils/indexedDBStorage';
import { insertDiamondIntoDb } from '../../server/db';

const mockDiamondWithImage = {
  id: 'diamond-test-img-1',
  title: '1.50 Carat Round Brilliant Lab Diamond',
  shape: 'Round Brilliant',
  carat: '1.50 Ct',
  color: 'D',
  clarity: 'VVS1',
  price: '$1,500.00',
  certNumber: 'CERT-1001',
  imageUrl: 'https://example.com/diamonds/real-stone-1.png',
  images: ['https://example.com/diamonds/real-stone-1.png'],
  naturalOrLab: 'Lab-grown',
  category: 'diamond',
  productType: 'diamond',
  isCustomAdded: true,
};

const mockDiamondWithoutImage = {
  id: 'diamond-test-no-img-2',
  title: '2.00 Carat Oval Brilliant Lab Diamond',
  shape: 'Oval',
  carat: '2.00 Ct',
  color: 'E',
  clarity: 'VS1',
  price: '$2,200.00',
  certNumber: 'CERT-1002',
  imageUrl: '',
  images: [],
  naturalOrLab: 'Lab-grown',
  category: 'diamond',
  productType: 'diamond',
  isCustomAdded: true,
};

describe('Product Image Loading, Error Fallback & Zero Dummy Image Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Case 1: ProductCardImage shows loading indicator when imageUrl is empty and NEVER renders an Unsplash or dummy image', () => {
    render(<ProductCardImage diamond={mockDiamondWithoutImage} onClick={vi.fn()} />);

    // Loading indicator must be visible
    const loadingElem = screen.getByTestId(`image-loading-${mockDiamondWithoutImage.id}`);
    expect(loadingElem).toBeInTheDocument();
    expect(loadingElem).toHaveTextContent(/Loading\.\.\./i);

    // No img element should have unsplash or any other image src
    const imgElems = screen.queryAllByRole('img');
    imgElems.forEach((img) => {
      expect(img.getAttribute('src')).not.toContain('unsplash');
    });
  });

  it('Case 2: ProductCardImage shows loading indicator while image is loading, with the img element hidden', () => {
    render(<ProductCardImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    // Initially loading state is rendered
    expect(screen.getByTestId(`image-loading-${mockDiamondWithImage.id}`)).toBeInTheDocument();

    // The image element is rendered with opacity-0 while loading
    const img = screen.getByTestId(`product-image-${mockDiamondWithImage.id}`);
    expect(img).toBeInTheDocument();
    expect(img.className).toContain('opacity-0');
    expect(img.getAttribute('src')).toBe(mockDiamondWithImage.imageUrl);
  });

  it('Case 3: ProductCardImage hides loading indicator and smoothly reveals image when onLoad fires', () => {
    render(<ProductCardImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    const img = screen.getByTestId(`product-image-${mockDiamondWithImage.id}`);

    // Trigger image onLoad event
    fireEvent.load(img);

    // Loading indicator must now be removed
    expect(screen.queryByTestId(`image-loading-${mockDiamondWithImage.id}`)).not.toBeInTheDocument();

    // Image element must now have opacity-100
    expect(img.className).toContain('opacity-100');
  });

  it('Case 4: ProductCardImage displays clean fallback placeholder when image fails (onError) and NEVER shows another image', () => {
    render(<ProductCardImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    const img = screen.getByTestId(`product-image-${mockDiamondWithImage.id}`);

    // Trigger image onError event
    fireEvent.error(img);

    // Error fallback container must be shown with loading/media notice
    const fallbackElem = screen.getByTestId(`image-fallback-${mockDiamondWithImage.id}`);
    expect(fallbackElem).toBeInTheDocument();
    expect(fallbackElem).toHaveTextContent(/Loading media/i);
    expect(fallbackElem).toHaveTextContent(/Round Brilliant/i);

    // Real img is removed or hidden and NO other image is displayed
    const imgs = screen.queryAllByRole('img');
    imgs.forEach((i) => {
      expect(i.getAttribute('src')).not.toContain('unsplash');
    });
  });

  it('Case 5: TableProductImage displays mini loading indicator while loading, and reveals on load', () => {
    render(<TableProductImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    // Initial loading indicator
    expect(screen.getByTestId(`image-loading-table-${mockDiamondWithImage.id}`)).toBeInTheDocument();

    const img = screen.getByTestId(`table-image-${mockDiamondWithImage.id}`);
    expect(img.className).toContain('opacity-0');

    // Fire onLoad
    fireEvent.load(img);
    expect(screen.queryByTestId(`image-loading-table-${mockDiamondWithImage.id}`)).not.toBeInTheDocument();
    expect(img.className).toContain('opacity-100');
  });

  it('Case 6: TableProductImage displays mini fallback when image fails (onError) without another image', () => {
    render(<TableProductImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    const img = screen.getByTestId(`table-image-${mockDiamondWithImage.id}`);
    fireEvent.error(img);

    expect(screen.getByTestId(`image-fallback-table-${mockDiamondWithImage.id}`)).toBeInTheDocument();
  });

  it('Case 7: Full ProductsPage Visual Grid View renders loading indicator on items and NEVER shows unsplash image', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([mockDiamondWithImage, mockDiamondWithoutImage]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Visual grid displays loading indicators for items
    expect(screen.getByTestId(`image-loading-${mockDiamondWithImage.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`image-loading-${mockDiamondWithoutImage.id}`)).toBeInTheDocument();

    // Verify completely that no image has unsplash URL
    const allImages = document.querySelectorAll('img');
    allImages.forEach((img) => {
      expect(img.src).not.toContain('unsplash');
    });
  });

  it('Case 8: Full ProductsPage B2B Table View renders table loading indicators and no unsplash fallback', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([mockDiamondWithImage, mockDiamondWithoutImage]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Switch to Table View
    const tableBtn = screen.getByTitle(/B2B Table List View/i);
    fireEvent.click(tableBtn);

    // Table loading indicators exist
    expect(screen.getByTestId(`image-loading-table-${mockDiamondWithImage.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`image-loading-table-${mockDiamondWithoutImage.id}`)).toBeInTheDocument();

    // Verify no unsplash images
    const allImages = document.querySelectorAll('img');
    allImages.forEach((img) => {
      expect(img.src).not.toContain('unsplash');
    });
  });

  it('Case 9: Detail Modal displays modal-image-loading indicator when opened in photo mode, and reveals on load', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([mockDiamondWithImage]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Open detail modal via View Media Gallery button
    const galleryBtns = screen.getAllByTestId('open-media-gallery-button');
    fireEvent.click(galleryBtns[0]);

    // Modal is opened
    expect(screen.getByText(/Media Gallery/i)).toBeInTheDocument();

    // Switch to photo mode inside modal if not already
    const photoButtons = screen.getAllByRole('button', { name: /Photo/i });
    if (photoButtons.length > 0) {
      fireEvent.click(photoButtons[0]);
    }

    // Modal loading indicator is rendered
    expect(screen.getByTestId('modal-image-loading')).toBeInTheDocument();

    // Fire load event on modal image
    const modalImg = screen.getByTestId('modal-diamond-image');
    fireEvent.load(modalImg);

    // Modal loading indicator disappears
    expect(screen.queryByTestId('modal-image-loading')).not.toBeInTheDocument();
    expect(modalImg.className).toContain('opacity-100');
  });

  it('Case 10: Detail Modal displays modal-image-fallback on onError and NEVER shows Unsplash', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([mockDiamondWithImage]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Open detail modal
    fireEvent.click(screen.getAllByTestId('open-media-gallery-button')[0]);

    const photoButtons = screen.getAllByRole('button', { name: /Photo/i });
    if (photoButtons.length > 0) {
      fireEvent.click(photoButtons[0]);
    }

    const modalImg = screen.getByTestId('modal-diamond-image');
    fireEvent.error(modalImg);

    expect(screen.getByTestId('modal-image-fallback')).toBeInTheDocument();

    const allImages = document.querySelectorAll('img');
    allImages.forEach((img) => {
      expect(img.src).not.toContain('unsplash');
    });
  });

  it('Case 11: HomePage diamond cards in photo mode show loading state and NEVER fall back to unsplash', async () => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify([mockDiamondWithImage]));

    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    // Switch card to photo mode
    const photoModeBtn = screen.getByRole('button', { name: /Photo/i });
    fireEvent.click(photoModeBtn);

    // Should display ProductCardImage with loading indicator
    expect(screen.getByTestId(`image-loading-${mockDiamondWithImage.id}`)).toBeInTheDocument();

    const allImages = document.querySelectorAll('img');
    allImages.forEach((img) => {
      expect(img.src).not.toContain('unsplash');
    });
  });

  it('Case 12: IndexedDB saveDbDiamondsToIndexedDB and loadDbDiamondsFromIndexedDB preserves items accurately', async () => {
    const testItems = [mockDiamondWithImage];
    const saved = await saveDbDiamondsToIndexedDB(testItems);
    expect(saved).toBe(true);

    const loaded = await loadDbDiamondsFromIndexedDB();
    expect(Array.isArray(loaded)).toBe(true);
    const item = loaded.find((d) => d.id === mockDiamondWithImage.id);
    expect(item).toBeDefined();
    expect(item.imageUrl).toBe(mockDiamondWithImage.imageUrl);
  });

  it('Case 13: ProductCardImage with already-complete/cached image immediately shows image and removes loading overlay', async () => {
    // Simulate browser cache where img.complete is true upon DOM mounting
    const originalNaturalWidth = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'naturalWidth');
    const originalComplete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'complete');

    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 500,
    });

    render(<ProductCardImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    // Because img.complete is true and naturalWidth > 0, loading indicator must NOT be stuck
    const img = screen.getByTestId(`product-image-${mockDiamondWithImage.id}`);
    expect(img).toBeInTheDocument();
    expect(img.className).toContain('opacity-100');
    expect(screen.queryByTestId(`image-loading-${mockDiamondWithImage.id}`)).not.toBeInTheDocument();

    // Restore original property descriptors
    if (originalComplete) Object.defineProperty(HTMLImageElement.prototype, 'complete', originalComplete);
    if (originalNaturalWidth) Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', originalNaturalWidth);
  });

  it('Case 14: Refresh on ProductsPage displays real item stone images from cached DB diamonds without stuck loading', async () => {
    localStorage.setItem('gk_cached_db_diamonds', JSON.stringify([mockDiamondWithImage]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Verify diamond card image element rendered with the correct stone src
    const img = screen.getByTestId(`product-image-${mockDiamondWithImage.id}`);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe(mockDiamondWithImage.imageUrl);

    // Fire onLoad (simulating image load completion)
    fireEvent.load(img);

    expect(screen.queryByTestId(`image-loading-${mockDiamondWithImage.id}`)).not.toBeInTheDocument();
    expect(img.className).toContain('opacity-100');
    expect(img.getAttribute('src')).not.toContain('unsplash');
  });

  it('Case 15: ProductsPage restores full imageUrl from IndexedDB when localStorage has stripped empty imageUrl', async () => {
    // Simulate quota-exceeded localStorage where imageUrl was stripped to empty string
    const strippedDiamond = { ...mockDiamondWithImage, imageUrl: '', images: [] };
    await insertDiamondIntoDb(mockDiamondWithImage);
    localStorage.setItem('gk_cached_db_diamonds', JSON.stringify([strippedDiamond]));

    // Full diamond with rich media is stored in IndexedDB
    await saveDbDiamondsToIndexedDB([mockDiamondWithImage]);

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // After IndexedDB hydration resolves, image element receives full real imageUrl
    const img = await screen.findByTestId(`product-image-${mockDiamondWithImage.id}`);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe(mockDiamondWithImage.imageUrl);

    fireEvent.load(img);
    expect(img.className).toContain('opacity-100');
    expect(screen.queryByTestId(`image-loading-${mockDiamondWithImage.id}`)).not.toBeInTheDocument();
  });

  it('Case 16: TableProductImage with complete/cached image immediately shows image without stuck loading', async () => {
    const originalNaturalWidth = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'naturalWidth');
    const originalComplete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'complete');

    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 500,
    });

    render(<TableProductImage diamond={mockDiamondWithImage} onClick={vi.fn()} />);

    const img = screen.getByTestId(`table-image-${mockDiamondWithImage.id}`);
    expect(img).toBeInTheDocument();
    expect(img.className).toContain('opacity-100');
    expect(screen.queryByTestId(`image-loading-table-${mockDiamondWithImage.id}`)).not.toBeInTheDocument();

    if (originalComplete) Object.defineProperty(HTMLImageElement.prototype, 'complete', originalComplete);
    if (originalNaturalWidth) Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', originalNaturalWidth);
  });

  it('Case 17: Diamond with base64 data URI image renders properly on ProductsPage and never falls back to dummy image', async () => {
    const base64Diamond = {
      ...mockDiamondWithImage,
      id: 'diamond-base64-test',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='],
    };

    localStorage.setItem('gk_cached_db_diamonds', JSON.stringify([base64Diamond]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const img = screen.getByTestId(`product-image-${base64Diamond.id}`);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('data:image/png;base64');

    fireEvent.load(img);
    expect(img.className).toContain('opacity-100');
    expect(screen.queryByTestId(`image-loading-${base64Diamond.id}`)).not.toBeInTheDocument();

    const allImages = document.querySelectorAll('img');
    allImages.forEach((image) => {
      expect(image.src).not.toContain('unsplash');
    });
  });

  it('Case 18: ProductCardImage with no image URL transitions to clean fallback after timeout and NEVER stays stuck in loading forever', async () => {
    vi.useFakeTimers();

    render(<ProductCardImage diamond={mockDiamondWithoutImage} onClick={vi.fn()} />);

    // Initially shows loading indicator
    expect(screen.getByTestId(`image-loading-${mockDiamondWithoutImage.id}`)).toBeInTheDocument();

    // Fast-forward past the 1000ms hydration grace period within act()
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Now transitions to fallback placeholder, not stuck in loading!
    expect(screen.getByTestId(`image-fallback-${mockDiamondWithoutImage.id}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`image-loading-${mockDiamondWithoutImage.id}`)).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('Case 19: First catalog item (custom-1791451187213-393) renders valid photo and 360° HD tab on ProductsPage', async () => {
    const firstItem = {
      id: 'custom-1791451187213-393',
      title: '1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond',
      shape: 'Round Brilliant',
      carat: '1.50 Ct',
      caratValue: 1.5,
      color: 'D',
      clarity: 'VVS1',
      price: '$1,500.00',
      cert: 'IGI Certified',
      certNumber: 'CERT-77440695',
      imageUrl: '/assets/valam/images/custom-1791451187213-393.jpg',
      images: ['/assets/valam/images/custom-1791451187213-393.jpg'],
      videoUrl: '/assets/valam/videos/custom-1791451187213-393.mp4',
      videoPoster: '/assets/nivaan/images/custom-1791451187213-393-poster.png',
      isCustomAdded: true,
    };

    localStorage.setItem('gk_custom_diamonds', JSON.stringify([firstItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Image element must exist with valid non-empty imageUrl
    const img = screen.getByTestId(`product-image-${firstItem.id}`);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/assets/valam/images/custom-1791451187213-393.jpg');

    // Fire image load
    fireEvent.load(img);
    expect(img.className).toContain('opacity-100');

    // Tab buttons for 360° HD and Photo must both be rendered on the first item's card
    const hdButton = screen.getByTitle('Switch to 360° Video');
    const photoButton = screen.getByTitle('Switch to Studio Photo');
    expect(hdButton).toBeInTheDocument();
    expect(photoButton).toBeInTheDocument();
  });

  it('Case 20: First catalog item toggles between Photo mode and 360° HD video mode on card', async () => {
    const firstItem = {
      id: 'custom-1791451187213-393',
      title: '1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond',
      shape: 'Round Brilliant',
      carat: '1.50 Ct',
      caratValue: 1.5,
      color: 'D',
      clarity: 'VVS1',
      price: '$1,500.00',
      cert: 'IGI Certified',
      certNumber: 'CERT-77440695',
      imageUrl: '/assets/valam/images/custom-1791451187213-393.jpg',
      images: ['/assets/valam/images/custom-1791451187213-393.jpg'],
      videoUrl: '/assets/valam/videos/custom-1791451187213-393.mp4',
      videoPoster: '/assets/nivaan/images/custom-1791451187213-393-poster.png',
      isCustomAdded: true,
    };

    localStorage.setItem('gk_custom_diamonds', JSON.stringify([firstItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Initial state: Photo mode is active
    expect(screen.getByTestId(`product-image-${firstItem.id}`)).toBeInTheDocument();

    // Click 360° HD tab button
    const hdButton = screen.getByTitle('Switch to 360° Video');
    fireEvent.click(hdButton);

    // Video element should now be rendered with the correct video source
    const videoElem = document.querySelector('video');
    expect(videoElem).toBeInTheDocument();
    expect(videoElem.getAttribute('src')).toBe('/assets/valam/videos/custom-1791451187213-393.mp4');

    // Click Photo tab button to return to Photo mode
    const photoButton = screen.getByTitle('Switch to Studio Photo');
    fireEvent.click(photoButton);

    // Product image element is back
    expect(screen.getByTestId(`product-image-${firstItem.id}`)).toBeInTheDocument();
  });

  it('Case 21: First catalog item detail modal renders media gallery with 360° video and photo toggles', async () => {
    const firstItem = {
      id: 'custom-1791451187213-393',
      title: '1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond',
      shape: 'Round Brilliant',
      carat: '1.50 Ct',
      caratValue: 1.5,
      color: 'D',
      clarity: 'VVS1',
      price: '$1,500.00',
      cert: 'IGI Certified',
      certNumber: 'CERT-77440695',
      imageUrl: '/assets/valam/images/custom-1791451187213-393.jpg',
      images: ['/assets/valam/images/custom-1791451187213-393.jpg'],
      videoUrl: '/assets/valam/videos/custom-1791451187213-393.mp4',
      videoPoster: '/assets/nivaan/images/custom-1791451187213-393-poster.png',
      isCustomAdded: true,
    };

    localStorage.setItem('gk_custom_diamonds', JSON.stringify([firstItem]));

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Open detail modal via View Media Gallery button
    const galleryBtns = screen.getAllByTestId('open-media-gallery-button');
    fireEvent.click(galleryBtns[0]);

    // Modal is opened
    expect(screen.getByText(/Media Gallery/i)).toBeInTheDocument();

    // In modal, since firstItem has videoUrl, 360° Video loop is active
    expect(screen.getByText(/360° HD Loop/i)).toBeInTheDocument();
    const modalVideo = document.querySelector('video');
    expect(modalVideo).toBeInTheDocument();
    expect(modalVideo.getAttribute('src')).toBe('/assets/valam/videos/custom-1791451187213-393.mp4');

    // Switch to Photo mode inside modal
    const photoButtons = screen.getAllByRole('button', { name: /Photo/i });
    expect(photoButtons.length).toBeGreaterThan(0);
    fireEvent.click(photoButtons[photoButtons.length - 1]);

    // Modal diamond image is rendered
    const modalImg = screen.getByTestId('modal-diamond-image');
    expect(modalImg).toBeInTheDocument();
    expect(modalImg.getAttribute('src')).toBe('/assets/valam/images/custom-1791451187213-393.jpg');

    // Fire load event on modal image
    fireEvent.load(modalImg);
    expect(modalImg.className).toContain('opacity-100');
  });
});
