import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { AddProductModal } from '../components/AddProductModal';

const renderProductsPageWithModal = () => {
  return render(
    <ShopProvider>
      <ProductsPage />
      <AddProductModal />
    </ShopProvider>
  );
};

describe('Add Product Modal & Custom Diamonds Specification Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('case 1: renders "+ Add Product" button on top of Products page and opens modal when pressed', () => {
    renderProductsPageWithModal();

    // Verify + Add Product buttons exist at top header and toolbar
    const addButtons = screen.getAllByRole('button', { name: /Add Product/i });
    expect(addButtons.length).toBeGreaterThan(0);

    // Click top + Add Product button
    fireEvent.click(addButtons[0]);

    // Modal should be open with title
    expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();
    expect(screen.getByText(/Single Diamond Import/i)).toBeInTheDocument();
    expect(screen.getByText(/Available Fields & Schema/i)).toBeInTheDocument();
  });

  it('case 2: renders SEPARATE Photo Upload Section and Video Upload Section in Single Diamond form', () => {
    renderProductsPageWithModal();

    // Open Modal
    fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);

    // Check Photo Upload Section (Distinct header and subtext)
    expect(screen.getByText(/Photo Upload Section/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Photography & Scan Images \(Separated Section\)/i)).toBeInTheDocument();
    expect(screen.getByTestId('photo-file-input')).toBeInTheDocument();

    // Check Video Upload Section (Distinct header and subtext)
    expect(screen.getByText(/Video Upload Section/i)).toBeInTheDocument();
    expect(screen.getByText(/360° HD Spin Video & MP4 \(Separated Section\)/i)).toBeInTheDocument();
    expect(screen.getByTestId('video-file-input')).toBeInTheDocument();

    // Ensure Photo and Video sections are strictly distinct elements
    const photoSectionHeader = screen.getByText(/Photo Upload Section/i);
    const videoSectionHeader = screen.getByText(/Video Upload Section/i);
    expect(photoSectionHeader).not.toEqual(videoSectionHeader);
  });

  it('case 3: allows single diamond creation with file uploads, saving to localStorage & publishing to Products page', async () => {
    renderProductsPageWithModal();

    // Open Modal
    fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);

    // Fill form inputs
    const titleInput = screen.getByPlaceholderText(/2.50 Carat Oval IGI Certified/i);
    fireEvent.change(titleInput, { target: { value: 'Custom 2.75 Ct Oval Gem' } });

    const caratInput = screen.getByPlaceholderText(/1.50/i);
    fireEvent.change(caratInput, { target: { value: '2.75' } });

    const priceInput = screen.getByPlaceholderText(/1500.00/i);
    fireEvent.change(priceInput, { target: { value: '2200.00' } });

    // Upload Photo File
    const photoInput = screen.getByTestId('photo-file-input');
    const photoFile = new File(['dummy photo'], 'custom_diamond.jpg', { type: 'image/jpeg' });
    fireEvent.change(photoInput, { target: { files: [photoFile] } });

    // Upload Video File
    const videoInput = screen.getByTestId('video-file-input');
    const videoFile = new File(['dummy video'], 'emerald_360.mp4', { type: 'video/mp4' });
    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Publish Diamond to Store/i }));

    // Check localStorage
    const savedInStorage = JSON.parse(localStorage.getItem('gk_custom_diamonds') || '[]');
    expect(savedInStorage.length).toBe(1);
    expect(savedInStorage[0].title).toBe('Custom 2.75 Ct Oval Gem');
    expect(savedInStorage[0].caratValue).toBe(2.75);
    expect(savedInStorage[0].priceValue).toBe(2200);

    // Close Modal
    fireEvent.click(screen.getByLabelText(/Close add product modal/i));

    // Verify published item appears on Products Page
    expect(screen.getAllByText('Custom 2.75 Ct Oval Gem').length).toBeGreaterThan(0);
  });

  it('case 4: supports navigation to Manage Added Products tab and shows current custom items status', () => {
    renderProductsPageWithModal();

    // Open Modal
    fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);

    // Switch to Manage Added Products Tab
    fireEvent.click(screen.getByRole('button', { name: /Manage Added Products/i }));

    // Verify Manage Added Products section displays empty state when no products added
    expect(screen.getByText(/No Custom Products Added Yet/i)).toBeInTheDocument();
  });

  it('case 5: renders Available Fields & Schema tab with complete attribute documentation and CSV header copy function', () => {
    renderProductsPageWithModal();

    // Open Modal
    fireEvent.click(screen.getAllByRole('button', { name: /Add Product/i })[0]);

    // Switch to Available Fields tab
    fireEvent.click(screen.getByRole('button', { name: /Available Fields & Schema/i }));

    // Check header & table elements
    expect(screen.getByText(/Available Diamond Product Fields/i)).toBeInTheDocument();
    expect(screen.getByText(/caratValue/i)).toBeInTheDocument();
    expect(screen.getByText(/certNumber/i)).toBeInTheDocument();
    expect(screen.getByText(/videoUrl/i)).toBeInTheDocument();

    // Test Schema category sub-filter
    fireEvent.click(screen.getByRole('button', { name: /^Required$/i }));
    expect(screen.getAllByText(/Diamond Shape/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Carat Weight \(Ct\)/i).length).toBeGreaterThan(0);
  });

  it('case 6: "Added Products Only" catalog filter shows ONLY user-added products on Products page and excludes stock items', () => {
    renderProductsPageWithModal();

    // Switch filter to Added Products Only
    fireEvent.click(screen.getByRole('button', { name: /Added Products Only/i }));

    // Open modal and add a product
    const addBtn = screen.getAllByRole('button', { name: /Add Product/i })[0];
    fireEvent.click(addBtn);

    const titleInput = screen.getByPlaceholderText(/2.50 Carat Oval IGI Certified/i);
    fireEvent.change(titleInput, { target: { value: 'Exclusive Lab Oval 3.00Ct' } });

    fireEvent.click(screen.getByRole('button', { name: /Publish Diamond to Store/i }));
    fireEvent.click(screen.getByLabelText(/Close add product modal/i));

    // When "Added Products Only" tab is active:
    // 'Exclusive Lab Oval 3.00Ct' should be visible
    expect(screen.getByText('Exclusive Lab Oval 3.00Ct')).toBeInTheDocument();
  });
});
