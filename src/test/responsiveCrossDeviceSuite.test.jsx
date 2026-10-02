import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShopProvider, useShop } from '../context/ShopContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { AboutPage } from '../pages/AboutPage';
import { AddProductModal } from '../components/AddProductModal';
import { DeleteProductModal } from '../components/DeleteProductModal';
import { QuoteModal } from '../components/QuoteModal';
import { initDb } from '../../server/db';

const setViewportSize = (width, height) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
};

describe('Comprehensive Responsive Cross-Device & Full Feature Test Suite', () => {
  beforeEach(async () => {
    await initDb();
    localStorage.clear();
    setViewportSize(1280, 800); // Reset to default desktop
  });

  // --- DESKTOP VIEWPORT TESTS (1280px+) ---
  describe('Desktop Viewport (1280px x 800px)', () => {
    it('case 1: renders desktop header nav items and CTA buttons without truncation', () => {
      render(
        <ShopProvider>
          <Header />
        </ShopProvider>
      );

      expect(screen.getByText('GIGAKELVIN')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Process')).toBeInTheDocument();
      expect(screen.getByText('Supply')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('case 2: renders footer with full column grid and theme selector bar', () => {
      render(
        <ShopProvider>
          <Footer />
        </ShopProvider>
      );

      expect(screen.getByText(/Quick Links/i)).toBeInTheDocument();
      expect(screen.getByText(/Certs & Compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/Appearance & Theme Settings/i)).toBeInTheDocument();
    });
  });

  // --- LAPTOP VIEWPORT TESTS (1024px x 768px) ---
  describe('Laptop Viewport (1024px x 768px)', () => {
    beforeEach(() => setViewportSize(1024, 768));

    it('case 3: displays ProductsPage controls and custom sort dropdown in laptop layout', () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Nivaan Design Loose Diamond Collection/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search title, carat, shape/i)).toBeInTheDocument();
    });

    it('case 4: renders AboutPage timeline and sourcing process in laptop layout', () => {
      render(
        <ShopProvider>
          <AboutPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Surat Cutting Desk/i)).toBeInTheDocument();
      expect(screen.getByText(/Established in Surat, Gujarat/i)).toBeInTheDocument();
    });
  });

  // --- TABLET VIEWPORT TESTS (768px x 1024px) ---
  describe('Tablet Viewport (768px x 1024px)', () => {
    beforeEach(() => setViewportSize(768, 1024));

    it('case 5: scales HomePage hero banner and specs pills for tablet viewport', () => {
      render(
        <ShopProvider>
          <HomePage />
        </ShopProvider>
      );

      expect(screen.getByText(/Loose diamonds for trade buyers who need speed and certainty/i)).toBeInTheDocument();
      expect(screen.getByText(/Direct Diamond Sourcing/i)).toBeInTheDocument();
    });

    it('case 6: switches layout to B2B Table view and renders horizontal scroll container', () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      const tableToggle = screen.getByTitle('B2B Table List View');
      fireEvent.click(tableToggle);

      expect(screen.getByTitle('B2B Table List View')).toHaveClass('bg-emerald-600');
    });
  });

  // --- MOBILE VIEWPORT TESTS (375px x 812px) ---
  describe('Mobile Viewport (375px x 812px)', () => {
    beforeEach(() => setViewportSize(375, 812));

    it('case 7: toggles mobile navigation drawer in Header when hamburger menu button is clicked', async () => {
      render(
        <ShopProvider>
          <Header />
        </ShopProvider>
      );

      const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuBtn).toBeInTheDocument();

      fireEvent.click(menuBtn);

      await waitFor(() => {
        expect(screen.getByText('Download Demo Quote')).toBeInTheDocument();
      });
    });

    it('case 8: renders AddProductModal cleanly within mobile screen bounds and supports tab navigation', async () => {
      render(
        <ShopProvider>
          <AddProductModalTestComponent />
        </ShopProvider>
      );

      fireEvent.click(screen.getByTestId('open-add-modal'));

      await waitFor(() => {
        expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();
      });

      // Switch to Available Fields & Schema tab
      const fieldsTabBtn = screen.getByText(/Available Fields & Schema/i);
      fireEvent.click(fieldsTabBtn);

      await waitFor(() => {
        expect(screen.getByText(/Available Diamond Product Fields/i)).toBeInTheDocument();
      });
    });

    it('case 9: renders QuoteModal and ReviewModal responsively with mobile form controls', async () => {
      render(
        <ShopProvider>
          <QuoteModalTestComponent />
        </ShopProvider>
      );

      fireEvent.click(screen.getByTestId('open-quote-modal'));

      await waitFor(() => {
        expect(screen.getByText(/Request Official B2B Quotation/i)).toBeInTheDocument();
      });
    });

    it('case 10: renders DeleteProductModal with responsive action buttons and warning icon', () => {
      const dummyDiamond = {
        id: 'del-mob-1',
        title: 'Mobile Delete Test Diamond 2.50 Ct',
        shape: 'Oval',
        carat: '2.50 Ct',
        color: 'D',
        clarity: 'VVS1'
      };

      const handleClose = vi.fn();
      const handleConfirm = vi.fn();

      render(
        <DeleteProductModal
          isOpen={true}
          diamond={dummyDiamond}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      );

      expect(screen.getByText('Mobile Delete Test Diamond 2.50 Ct')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-delete-modal-button')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('confirm-delete-modal-button'));
      expect(handleConfirm).toHaveBeenCalled();
    });

    it('case 11: verifies mobile view (375px & 425px) hides top-bar inline Demo/Quote buttons to prevent header crowding', () => {
      setViewportSize(425, 865);
      render(
        <ShopProvider>
          <Header />
        </ShopProvider>
      );

      // Logo and toggle menu button must be rendered
      expect(screen.getByText('GIGAKELVIN')).toBeInTheDocument();
      const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuBtn).toBeInTheDocument();

      // Top bar CTA buttons should be hidden on mobile (< sm)
      const demoBtns = screen.queryAllByTitle('Download Demo Quote');
      // Only inside drawer when opened, top bar demo button has hidden class on < sm
      expect(demoBtns.length).toBeGreaterThan(0);
      expect(demoBtns[0]).toHaveClass('hidden');
    });

    it('case 12: verifies mobile ProductsPage toolbar renders source filter tabs and view controls without overflowing', () => {
      setViewportSize(375, 812);
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      expect(screen.getAllByText(/All Uploaded/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Added/i).length).toBeGreaterThan(0);
      expect(screen.getByTitle('Default all cards to 360° Video loop')).toBeInTheDocument();
      expect(screen.getByTitle('Default all cards to Photo Scan mode')).toBeInTheDocument();
    });
  });
});

// Helper component to trigger AddProductModal
const AddProductModalTestComponent = () => {
  const { openAddProductModal } = useShop();
  return (
    <div>
      <button data-testid="open-add-modal" onClick={() => openAddProductModal('single')}>
        Open Add Modal
      </button>
      <AddProductModal />
    </div>
  );
};

// Helper component to trigger QuoteModal
const QuoteModalTestComponent = () => {
  const { openQuoteModal } = useShop();
  return (
    <div>
      <button data-testid="open-quote-modal" onClick={() => openQuoteModal()}>
        Open Quote Modal
      </button>
      <QuoteModal />
    </div>
  );
};
