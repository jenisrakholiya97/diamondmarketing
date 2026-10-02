import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { ProductsPage } from '../pages/ProductsPage';
import { isLocalhost } from '../utils/isLocalhost';

const mockDiamonds = [
  {
    id: 'test-vis-1',
    title: '1.50 Carat Round Lab Diamond',
    shape: 'Round Brilliant',
    carat: '1.50 Ct',
    color: 'D',
    clarity: 'VVS1',
    cut: '3X EX',
    certNumber: 'IGI-99901',
    price: '$1,200',
    category: 'Round Brilliant'
  }
];

describe('Localhost vs Live Environment Button Visibility Test Suite', () => {
  const originalLocation = window.location;

  const setHostname = (hostname) => {
    delete window.location;
    window.location = { ...originalLocation, hostname };
  };

  beforeEach(() => {
    localStorage.setItem('gk_custom_diamonds', JSON.stringify(mockDiamonds));
  });

  afterEach(() => {
    window.location = originalLocation;
    localStorage.clear();
  });

  describe('isLocalhost utility function tests', () => {
    it('returns true for local hostnames (localhost, 127.0.0.1, LAN IPs, .local)', () => {
      ['localhost', '127.0.0.1', '[::1]', '', 'dev-server.local', '192.168.1.150', '10.0.0.5', '172.20.10.2'].forEach((host) => {
        setHostname(host);
        expect(isLocalhost()).toBe(true);
      });
    });

    it('returns false for live / production hostnames', () => {
      ['gigakelvin.com', 'nivvanjewels.com', 'app.vercel.app', 'diamondmarketing.netlify.app', 'b2b-diamonds.org'].forEach((host) => {
        setHostname(host);
        expect(isLocalhost()).toBe(false);
      });
    });
  });

  describe('ProductsPage UI button visibility in Localhost environment', () => {
    beforeEach(() => {
      setHostname('localhost');
    });

    it('renders "+ Add Product" buttons on header and toolbar when on localhost', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      const addButtons = await screen.findAllByRole('button', { name: /Add Product/i });
      expect(addButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('renders Delete and Edit product buttons on grid cards when on localhost', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      const deleteButtons = await screen.findAllByTitle('Delete Product from Database');
      expect(deleteButtons.length).toBeGreaterThan(0);

      const editButtons = await screen.findAllByTitle('Edit Product Details');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('renders Delete and Edit buttons in product detail modal when on localhost', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      const eyeButtons = await screen.findAllByTitle('View Media Gallery');
      fireEvent.click(eyeButtons[0]);

      expect(await screen.findByTestId('delete-modal-product-button')).toBeInTheDocument();
      expect(await screen.findByTestId('edit-modal-product-button')).toBeInTheDocument();
    });
  });

  describe('ProductsPage UI button visibility in Live / Production site environment', () => {
    beforeEach(() => {
      setHostname('gigakelvin.com');
    });

    it('does NOT render any "+ Add Product" buttons on live site', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      await screen.findByText(/1.50 Carat Round Lab Diamond/i);
      const addButtons = screen.queryAllByRole('button', { name: /Add Product/i });
      expect(addButtons).toHaveLength(0);
    });

    it('does NOT render Delete or Edit product buttons on product grid cards or tables on live site', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      await screen.findByText(/1.50 Carat Round Lab Diamond/i);
      const deleteButtons = screen.queryAllByTitle('Delete Product from Database');
      expect(deleteButtons).toHaveLength(0);

      const editButtons = screen.queryAllByTitle('Edit Product Details');
      expect(editButtons).toHaveLength(0);
    });

    it('does NOT render Delete or Edit product button in detail modal on live site', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      const eyeButtons = await screen.findAllByTitle('View Media Gallery');
      fireEvent.click(eyeButtons[0]);

      expect(screen.queryByTestId('delete-modal-product-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('edit-modal-product-button')).not.toBeInTheDocument();
    });

    it('does NOT render "Add Custom Diamond Now" or "+ Add Product" buttons on live site when added products tab selected', async () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      await screen.findByText(/1.50 Carat Round Lab Diamond/i);
      const addedTab = await screen.findByRole('button', { name: /Added Products Only/i });
      fireEvent.click(addedTab);

      expect(screen.queryByRole('button', { name: /Add Custom Diamond Now/i })).not.toBeInTheDocument();
      expect(screen.queryAllByRole('button', { name: /Add Product/i })).toHaveLength(0);
    });
  });
});
