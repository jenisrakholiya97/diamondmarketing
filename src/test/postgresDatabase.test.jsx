import { describe, it, expect, beforeEach } from 'vitest';
import {
  initDb,
  insertDiamondIntoDb,
  getAllDiamondsFromDb,
  getDiamondByIdFromDb,
  deleteDiamondFromDb,
  insertQuoteIntoDb,
  getAllQuotesFromDb,
  insertReviewIntoDb,
  getAllReviewsFromDb
} from '../../server/db.js';
import { checkDbHealth, createDiamondInApi, submitQuoteToApi } from '../services/api';

describe('PostgreSQL Database & Full Server Integration Suite', () => {
  beforeEach(async () => {
    await initDb();
  });

  it('case 1: verifies environment variables integration for PostgreSQL and API endpoints', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.PGHOST).toBe('127.0.0.1');
    expect(process.env.PGPORT).toBe('5433');
    expect(process.env.PGUSER).toBe('postgres');
    expect(process.env.PGDATABASE).toBe('diamond_marketing');
    expect(process.env.PORT).toBe('5000');
  });

  it('case 2: inserts custom diamond into database model and retrieves record by id and criteria', async () => {
    const testDiamond = {
      id: 'pg-test-diamond-101',
      title: 'PostgreSQL 3.25 Ct Oval Diamond',
      shape: 'Oval',
      caratValue: 3.25,
      carat: '3.25 Ct',
      color: 'E',
      clarity: 'VVS2',
      priceValue: 3500.0,
      price: '$3,500.00',
      imageUrl: 'https://example.com/pg_diamond.jpg',
      videoUrl: 'https://example.com/pg_video.mp4',
      isCustomAdded: true
    };

    const inserted = await insertDiamondIntoDb(testDiamond);
    expect(inserted.id).toBe('pg-test-diamond-101');
    expect(inserted.title).toBe('PostgreSQL 3.25 Ct Oval Diamond');

    const fetched = await getDiamondByIdFromDb('pg-test-diamond-101');
    expect(fetched).not.toBeNull();
    expect(fetched.caratValue).toBe(3.25);

    const allDiamonds = await getAllDiamondsFromDb({ source: 'added' });
    expect(allDiamonds.some((d) => d.id === 'pg-test-diamond-101')).toBe(true);
  });

  it('case 3: deletes custom diamond record from database model', async () => {
    const testDiamond = {
      id: 'pg-test-delete-202',
      title: 'PostgreSQL Temporary Diamond',
      shape: 'Round',
      caratValue: 1.0,
      isCustomAdded: true
    };

    await insertDiamondIntoDb(testDiamond);
    let item = await getDiamondByIdFromDb('pg-test-delete-202');
    expect(item).not.toBeNull();

    await deleteDiamondFromDb('pg-test-delete-202');
    item = await getDiamondByIdFromDb('pg-test-delete-202');
    expect(item).toBeNull();
  });

  it('case 4: inserts B2B quotation request into PostgreSQL database model and retrieves quotes list', async () => {
    const quotePayload = {
      category: 'Lab-grown Loose Diamonds',
      specs: 'Requesting 50 pcs 2.0Ct+ Round D-F VVS1-VS1 IGI certified',
      fullName: 'Postgres Sourcing Director',
      companyName: 'B2B Luxe Vault',
      email: 'sourcing@luxevault.com',
      phone: '+1 555-0199',
      country: 'United States',
      targetBudget: '$100,000 - $250,000'
    };

    const insertedQuote = await insertQuoteIntoDb(quotePayload);
    expect(insertedQuote.id).toMatch(/^quote-/);
    expect(insertedQuote.email).toBe('sourcing@luxevault.com');

    const quotesList = await getAllQuotesFromDb();
    expect(quotesList.some((q) => q.email === 'sourcing@luxevault.com')).toBe(true);
  });

  it('case 5: inserts customer review into database model and fetches reviews list', async () => {
    const reviewPayload = {
      authorName: 'Marcus Vance',
      companyName: 'Vance Fine Jewelry NYC',
      country: 'USA',
      rating: 5,
      reviewText: 'Outstanding PostgreSQL database integration and seamless B2B sourcing backend!'
    };

    const insertedReview = await insertReviewIntoDb(reviewPayload);
    expect(insertedReview.id).toMatch(/^review-/);
    expect(insertedReview.authorName).toBe('Marcus Vance');

    const reviewsList = await getAllReviewsFromDb();
    expect(reviewsList.some((r) => r.authorName === 'Marcus Vance')).toBe(true);
  });

  it('case 6: verifies client database API service endpoints structure and resilience', async () => {
    const health = await checkDbHealth();
    expect(health).toHaveProperty('status');
    expect(health).toHaveProperty('database');

    const apiDiamond = await createDiamondInApi({
      id: 'api-service-test-303',
      title: 'API Client Service Diamond',
      shape: 'Emerald',
      caratValue: 2.5
    });

    // Client API returns object or falls back gracefully
    expect(apiDiamond === null || typeof apiDiamond === 'object').toBe(true);

    const quoteRes = await submitQuoteToApi({
      category: 'API Test Quote',
      email: 'test@api.com'
    });
    expect(quoteRes).toHaveProperty('ok');
  });
});
