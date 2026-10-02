import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { SupplyPage } from '../pages/SupplyPage';
import { QuoteModal } from '../components/QuoteModal';

describe('Loose Diamond Supply Matrix Component', () => {
  it('should render shape, carat, color, and clarity filters', () => {
    render(
      <ShopProvider>
        <SupplyPage />
      </ShopProvider>
    );

    expect(screen.getByText(/Loose Diamond Supply/i)).toBeInTheDocument();
    expect(screen.getByText('Round Brilliant')).toBeInTheDocument();
    expect(screen.getByText('Oval')).toBeInTheDocument();
    expect(screen.getByText('Emerald')).toBeInTheDocument();

    // Verify Color and Clarity grade labels and buttons are rendered
    expect(screen.getByText(/^Color$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Clarity$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'D' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VVS1' })).toBeInTheDocument();
  });

  it('should update active selection summary when shape, color, and clarity are selected', () => {
    render(
      <ShopProvider>
        <SupplyPage />
      </ShopProvider>
    );

    const ovalBtn = screen.getByRole('button', { name: 'Oval' });
    fireEvent.click(ovalBtn);

    const colorEBtn = screen.getByRole('button', { name: 'E' });
    fireEvent.click(colorEBtn);

    const clarityVVS1Btn = screen.getByRole('button', { name: 'VVS1' });
    fireEvent.click(clarityVVS1Btn);

    expect(screen.getByText(/Lab-grown Loose Diamond • Oval/i)).toBeInTheDocument();
  });

  it('should display Lab-Grown (IGI / GCAL 8X) certification standard by default', () => {
    render(
      <ShopProvider>
        <SupplyPage />
      </ShopProvider>
    );

    expect(screen.getByText(/IGI \/ GCAL 8X/i)).toBeInTheDocument();
  });

  it('should quote only single specification when matrix quote button is clicked', () => {
    render(
      <ShopProvider>
        <SupplyPage />
        <QuoteModal />
      </ShopProvider>
    );

    // Click single spec quote button in matrix box
    const singleSpecQuoteBtn = screen.getByRole('button', { name: /Request Quote/i });
    fireEvent.click(singleSpecQuoteBtn);

    // Modal should open with single item specs
    expect(screen.getByDisplayValue(/Category: Lab-grown/i)).toBeInTheDocument();
  });

  it('should add a specification to the specification list when clicking "Add to list"', () => {
    render(
      <ShopProvider>
        <SupplyPage />
      </ShopProvider>
    );

    const addBtn = screen.getByRole('button', { name: /Add to list/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Specification added to quote request/i)).toBeInTheDocument();
    expect(screen.getByText(/Configured Specs/i)).toBeInTheDocument();
    expect(screen.getByText(/#1/i)).toBeInTheDocument();
  });

  it('should support adding multiple specifications and removing an item from the list', () => {
    render(
      <ShopProvider>
        <SupplyPage />
      </ShopProvider>
    );

    // Add 1st specification (Round D VS1)
    const addBtn = screen.getByRole('button', { name: /Add to list/i });
    fireEvent.click(addBtn);

    // Select 2nd specification (Emerald F VVS2)
    const emeraldBtn = screen.getByRole('button', { name: 'Emerald' });
    fireEvent.click(emeraldBtn);

    const colorFBtn = screen.getByRole('button', { name: 'F' });
    fireEvent.click(colorFBtn);

    const vvs2Btn = screen.getByRole('button', { name: 'VVS2' });
    fireEvent.click(vvs2Btn);

    // Add 2nd specification
    fireEvent.click(addBtn);

    // Verify both items exist in list (#1 and #2)
    expect(screen.getByText(/#1/i)).toBeInTheDocument();
    expect(screen.getByText(/#2/i)).toBeInTheDocument();
    expect(screen.getAllByText('Emerald').length).toBeGreaterThan(0);

    // Remove 1st specification
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    fireEvent.click(removeButtons[0]);

    // Verify only 1 specification remains in list
    expect(screen.getAllByRole('button', { name: /Remove/i }).length).toBe(1);
  });

  it('should trigger Quote Modal with prefilled specification list when requested from list section', () => {
    render(
      <ShopProvider>
        <SupplyPage />
        <QuoteModal />
      </ShopProvider>
    );

    // Add specification
    const addBtn = screen.getByRole('button', { name: /Add to list/i });
    fireEvent.click(addBtn);

    // Click Request Quote for Specification List at bottom of list
    const quoteListBtn = screen.getByRole('button', { name: /Request all specs \(1\)/i });
    fireEvent.click(quoteListBtn);

    // Modal should open with prefilled text of list
    expect(screen.getByDisplayValue(/Required Loose Stone Specifications List \(1 items\)/i)).toBeInTheDocument();
  });
});
