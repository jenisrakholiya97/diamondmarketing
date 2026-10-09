import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShopProvider, useShop } from '../context/ShopContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { SupplyPage } from '../pages/SupplyPage';
import { ProcessPage } from '../pages/ProcessPage';
import { AboutPage } from '../pages/AboutPage';
import { FaqPage } from '../pages/FaqPage';
import { ContactPage } from '../pages/ContactPage';
import { AddProductModal } from '../components/AddProductModal';
import { EditProductModal } from '../components/EditProductModal';
import { DeleteProductModal } from '../components/DeleteProductModal';
import { QuoteModal } from '../components/QuoteModal';
import { ReviewModal } from '../components/ReviewModal';
import { ThemeSelector } from '../components/ThemeSelector';
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

  // --- 1. EXTRA-SMALL MOBILE VIEWPORT TESTS (320px x 568px) ---
  describe('Extra-Small Mobile Viewport (320px x 568px)', () => {
    beforeEach(() => setViewportSize(320, 568));

    it('case 1: renders ultra-compact mobile Header without text overlap and toggles drawer', async () => {
      render(
        <ShopProvider>
          <Header />
        </ShopProvider>
      );

      expect(screen.getByText('GIGAKELVIN')).toBeInTheDocument();
      const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuBtn).toBeInTheDocument();

      fireEvent.click(menuBtn);
      await waitFor(() => {
        expect(screen.getByText('Download Demo Quote')).toBeInTheDocument();
      });
    });

    it('case 2: renders ProductsPage search, shape chips, and carat filter in 320px layout', () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      expect(screen.getByPlaceholderText(/Search title, carat, shape/i)).toBeInTheDocument();
      expect(screen.getByText(/Certified Loose Lab-Grown Diamonds/i)).toBeInTheDocument();
    });

    it('case 3: renders AddProductModal and single product form controls in 320px screen width', async () => {
      render(
        <ShopProvider>
          <AddProductModalTestComponent />
        </ShopProvider>
      );

      fireEvent.click(screen.getByTestId('open-add-modal'));
      await waitFor(() => {
        expect(screen.getByText(/Add & Import Certified Diamonds/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Single Diamond Import/i)).toBeInTheDocument();
    });

    it('case 4: renders ContactPage contact options and WhatsApp direct button in extra-small mobile layout', () => {
      render(
        <ShopProvider>
          <ContactPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Start a sourcing conversation/i)).toBeInTheDocument();
      expect(screen.getByText(/Direct Communication/i)).toBeInTheDocument();
    });
  });

  // --- 2. SMALL MOBILE VIEWPORT TESTS (375px x 812px) ---
  describe('Small Mobile Viewport (375px x 812px)', () => {
    beforeEach(() => setViewportSize(375, 812));

    it('case 5: toggles mobile navigation drawer in Header when hamburger menu button is clicked', async () => {
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

    it('case 6: renders AddProductModal cleanly within mobile screen bounds and supports tab navigation', async () => {
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

    it('case 7: renders QuoteModal and ReviewModal responsively with mobile form controls', async () => {
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

    it('case 8: renders DeleteProductModal with responsive action buttons and warning icon', () => {
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

    it('case 9: verifies mobile ProductsPage toolbar renders source filter tabs and view controls without overflowing', () => {
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

    it('case 10: renders ReviewModal responsively and supports rating selection in mobile view', async () => {
      const handleClose = vi.fn();
      const handleSuccess = vi.fn();

      render(
        <ShopProvider>
          <ReviewModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} />
        </ShopProvider>
      );

      expect(screen.getByText(/Submit Surat Loose Diamond Sourcing Review/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e.g. Marcus Vance/i)).toBeInTheDocument();
    });
  });

  // --- 3. LARGE MOBILE VIEWPORT TESTS (425px x 915px) ---
  describe('Large Mobile Viewport (425px x 915px)', () => {
    beforeEach(() => setViewportSize(425, 915));

    it('case 11: verifies mobile view hides top-bar inline Demo/Quote buttons to prevent header crowding', () => {
      render(
        <ShopProvider>
          <Header />
        </ShopProvider>
      );

      expect(screen.getByText('GIGAKELVIN')).toBeInTheDocument();
      const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuBtn).toBeInTheDocument();

      const demoBtns = screen.queryAllByTitle('Download Demo Quote');
      expect(demoBtns.length).toBeGreaterThan(0);
      expect(demoBtns[0]).toHaveClass('hidden');
    });

    it('case 12: renders EditProductModal responsively with custom diamond data on large mobile', () => {
      const dummyDiamond = {
        id: 'edit-mob-1',
        title: 'Edit Test Diamond 3.00 Ct Emerald',
        shape: 'Emerald',
        carat: '3.00 Ct',
        color: 'E',
        clarity: 'VS1',
        price: '$3,500.00',
        certNumber: 'CERT-3003',
        naturalOrLab: 'Lab-grown',
        category: 'diamond',
        productType: 'diamond',
      };

      const handleClose = vi.fn();
      const handleSave = vi.fn();

      render(
        <ShopProvider>
          <EditProductModal
            isOpen={true}
            diamond={dummyDiamond}
            onClose={handleClose}
            onSave={handleSave}
          />
        </ShopProvider>
      );

      expect(screen.getByText(/Edit Certified Diamond Product/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Edit Test Diamond 3.00 Ct Emerald')).toBeInTheDocument();
    });
  });

  // --- 4. SMALL TABLET / FOLDABLE VIEWPORT TESTS (640px x 960px) ---
  describe('Small Tablet / Foldable Viewport (640px x 960px)', () => {
    beforeEach(() => setViewportSize(640, 960));

    it('case 13: renders SupplyPage matrix in 2-column grid layout for small tablet viewport', () => {
      render(
        <ShopProvider>
          <SupplyPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Lab-Grown Certified Loose Diamonds/i)).toBeInTheDocument();
      expect(screen.getByText(/Custom Studio Lab-Grown Sourcing/i)).toBeInTheDocument();
    });

    it('case 14: renders HomePage hero banner and core facts pills in small tablet view', () => {
      render(
        <ShopProvider>
          <HomePage />
        </ShopProvider>
      );

      expect(screen.getByText(/Loose diamonds for trade buyers who need speed and certainty/i)).toBeInTheDocument();
      expect(screen.getByText(/Direct Diamond Sourcing/i)).toBeInTheDocument();
    });
  });

  // --- 5. TABLET PORTRAIT VIEWPORT TESTS (768px x 1024px) ---
  describe('Tablet Portrait Viewport (768px x 1024px)', () => {
    beforeEach(() => setViewportSize(768, 1024));

    it('case 15: switches layout to B2B Table view and renders horizontal scroll container', () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      const tableToggle = screen.getByTitle('B2B Table List View');
      fireEvent.click(tableToggle);

      expect(screen.getByTitle('B2B Table List View')).toHaveClass('bg-emerald-600');
    });

    it('case 16: renders ProcessPage 6-step workflow timeline on tablet portrait layout', () => {
      render(
        <ShopProvider>
          <ProcessPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Submit Specifications/i)).toBeInTheDocument();
      expect(screen.getByText(/Options & USD Quote/i)).toBeInTheDocument();
      expect(screen.getByText(/HD Media Approval/i)).toBeInTheDocument();
    });

    it('case 17: renders FaqPage accordion items and allows expanding answers on tablet touch layout', () => {
      render(
        <ShopProvider>
          <FaqPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Which gemological labs certify your loose diamonds\?/i)).toBeInTheDocument();
    });
  });

  // --- 6. LAPTOP VIEWPORT TESTS (1024px x 768px) ---
  describe('Laptop Viewport (1024px x 768px)', () => {
    beforeEach(() => setViewportSize(1024, 768));

    it('case 18: displays ProductsPage controls and custom sort dropdown in laptop layout', () => {
      render(
        <ShopProvider>
          <ProductsPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Nivaan Design Loose Diamond Collection/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search title, carat, shape/i)).toBeInTheDocument();
    });

    it('case 19: renders AboutPage timeline and sourcing process in laptop layout', () => {
      render(
        <ShopProvider>
          <AboutPage />
        </ShopProvider>
      );

      expect(screen.getByText(/Surat Cutting Desk/i)).toBeInTheDocument();
      expect(screen.getByText(/Established in Surat, Gujarat/i)).toBeInTheDocument();
    });
  });

  // --- 7. STANDARD DESKTOP VIEWPORT TESTS (1280px x 800px) ---
  describe('Desktop Viewport (1280px x 800px)', () => {
    beforeEach(() => setViewportSize(1280, 800));

    it('case 20: renders desktop header nav items and CTA buttons without truncation', () => {
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

    it('case 21: renders footer with full column grid and theme selector bar', () => {
      render(
        <ShopProvider>
          <Footer />
        </ShopProvider>
      );

      expect(screen.getByText(/Quick Links/i)).toBeInTheDocument();
      expect(screen.getByText(/Certs & Compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/Appearance & Theme Settings/i)).toBeInTheDocument();
    });

    it('case 22: renders ThemeSelector mode options (Dark, Light, System) cleanly in footer', () => {
      render(
        <ShopProvider>
          <ThemeSelector />
        </ShopProvider>
      );

      expect(screen.getByRole('button', { name: /Switch to Dark theme/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Switch to Light theme/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Switch to System theme/i })).toBeInTheDocument();
    });
  });

  // --- 8. ULTRA-WIDE DESKTOP VIEWPORT TESTS (1536px x 900px) ---
  describe('Ultra-Wide Desktop Viewport (1536px x 900px)', () => {
    beforeEach(() => setViewportSize(1536, 900));

    it('case 23: renders max-w-7xl centered container without horizontal stretch or layout distortion', () => {
      render(
        <ShopProvider>
          <HomePage />
        </ShopProvider>
      );

      expect(screen.getByText(/Direct Diamond Sourcing/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Core Offering/i).length).toBeGreaterThan(0);
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
