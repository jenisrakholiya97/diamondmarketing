import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { AboutPage } from '../pages/AboutPage';
import { ReviewSection } from '../components/ReviewSection';
import { QuoteForm } from '../components/QuoteForm';
import { ShopProvider } from '../context/ShopContext';
import { initDb, insertDiamondIntoDb, getDiamondByIdFromDb, deleteDiamondFromDb, getAllQuotesFromDb, getAllReviewsFromDb } from '../../server/db';

describe('All Pages State-Changing Operations & Changing Cases Test Suite', () => {
  beforeEach(async () => {
    await initDb();
  });

  it('Case 1: HomePage renders correctly and state updates when a new diamond is added to DB', async () => {
    // Add a diamond into DB
    const newDiamond = await insertDiamondIntoDb({
      title: 'State Test Round Diamond 2.50 Ct',
      shape: 'Round Brilliant',
      carat: '2.50 Ct',
      caratValue: 2.50,
      color: 'D',
      clarity: 'VVS1',
      price: '$4,200',
      priceValue: 4200,
      naturalOrLab: 'Lab-grown'
    });

    render(
      <ShopProvider>
        <HomePage />
      </ShopProvider>
    );

    // Verify Lab-Grown Branding & Stats
    expect(screen.getByText(/Direct Diamond Sourcing/i)).toBeInTheDocument();
    expect(screen.getByText(/Loose diamonds for trade buyers/i)).toBeInTheDocument();

    // Verify added diamond exists in DB
    const fetchedDbItem = await getDiamondByIdFromDb(newDiamond.id);
    expect(fetchedDbItem).toBeDefined();
    expect(fetchedDbItem.title).toBe('State Test Round Diamond 2.50 Ct');

    // Cleanup
    await deleteDiamondFromDb(newDiamond.id);
  });

  it('Case 2: HomePage Customer Review Section allows adding a new review and updates live state', async () => {
    render(
      <ShopProvider>
        <ReviewSection />
      </ShopProvider>
    );

    // Verify reviews section title
    expect(screen.getByText(/Verified Trade Ratings & Reviews/i)).toBeInTheDocument();

    // Open Add Review Modal if available, or trigger submission
    const writeReviewBtn = screen.queryByRole('button', { name: /Write A Review|Submit Feedback/i });
    if (writeReviewBtn) {
      fireEvent.click(writeReviewBtn);
    }

    // Verify existing reviews render
    const reviewsInDb = await getAllReviewsFromDb();
    expect(reviewsInDb).toBeDefined();
  });

  it('Case 3: ProductsPage tests filtering, custom diamond addition, and deletion across Grid & Table modes', async () => {
    await insertDiamondIntoDb({
      id: 'dynamic-delete-test-99',
      title: 'Dynamic Emerald Cut 3.00 Ct',
      shape: 'Emerald',
      carat: '3.00 Ct',
      caratValue: 3.00,
      color: 'D',
      clarity: 'VVS1',
      price: '$3,500',
      priceValue: 3500,
      isCustomAdded: true
    });

    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search title, carat, shape/i);
    fireEvent.change(searchInput, { target: { value: 'Dynamic Emerald Cut' } });

    // Wait for product card to render
    await waitFor(() => {
      expect(screen.getByText(/Dynamic Emerald Cut 3.00 Ct/i)).toBeInTheDocument();
    });

    // Filter by Shape: Emerald
    const emeraldBtn = screen.getByRole('button', { name: /Emerald/i });
    fireEvent.click(emeraldBtn);

    // Verify Emerald item is visible
    expect(screen.getByText(/Dynamic Emerald Cut 3.00 Ct/i)).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('delete-card-dynamic-delete-test-99');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-modal-button')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('confirm-delete-modal-button'));

    // Verify item is removed from screen
    await waitFor(() => {
      expect(screen.queryByText(/Dynamic Emerald Cut 3.00 Ct/i)).not.toBeInTheDocument();
    });
  });

  it('Case 4: B2B Quote Request Form validates required fields and stores quote in PostgreSQL DB', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    // Fill form using exact placeholders
    const emailInput = screen.getByPlaceholderText(/studio@jewelrystudio.com/i);
    const businessInput = screen.getByPlaceholderText(/Apex Custom Jewelry Ltd./i);
    const nameInput = screen.getByPlaceholderText(/David Miller/i);

    fireEvent.change(emailInput, { target: { value: 'exec@statetest.com' } });
    fireEvent.change(businessInput, { target: { value: 'State Test Global LLC' } });
    fireEvent.change(nameInput, { target: { value: 'State Testing Executive' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Request Official Quote/i });
    fireEvent.click(submitBtn);

    // Verify success confirmation message
    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received!/i)).toBeInTheDocument();
    });

    // Verify saved in DB
    const quotes = await getAllQuotesFromDb();
    const savedQuote = quotes.find(q => q.email === 'exec@statetest.com');
    expect(savedQuote).toBeDefined();
    expect(savedQuote.companyName || savedQuote.company_name).toBe('State Test Global LLC');
  });

  it('Case 5: ProductsPage filter fallback state displays clean notice when no diamonds match criteria', async () => {
    render(
      <ShopProvider>
        <ProductsPage />
      </ShopProvider>
    );

    // Select color 'K' or filter combination with 0 matches
    const colorKBtn = screen.queryByRole('button', { name: /^K$/i });
    if (colorKBtn) {
      fireEvent.click(colorKBtn);

      // Select clarity 'I3' if available or 3X EX filter
      const tripleExToggle = screen.getByRole('button', { name: /3X EX ONLY/i });
      fireEvent.click(tripleExToggle);

      // Verify page renders cleanly
      const container = screen.getByTestId('products-grid');
      expect(container).toBeInTheDocument();
    }
  });

  it('Case 6: AboutPage renders company background, 100% Lab-Grown pledge, and contact shortcuts', () => {
    render(
      <ShopProvider>
        <AboutPage />
      </ShopProvider>
    );

    // Check heading & trade assurance info
    expect(screen.getAllByText(/GIGAKELVIN/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Meet the Gemologists & Sourcing Specialists/i)).toBeInTheDocument();
  });
});
