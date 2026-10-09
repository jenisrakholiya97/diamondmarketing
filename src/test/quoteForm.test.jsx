import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { QuoteForm } from '../components/QuoteForm';

describe('B2B Quote Form Component', () => {
  it('should render required email field by default and toggle to whatsapp field when selected', () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    // Default Email channel
    expect(screen.getByLabelText(/Business Email Address/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/WhatsApp Phone Number/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request Official Quote/i })).toBeInTheDocument();

    // Switch channel to WhatsApp
    const whatsappBtn = screen.getByRole('button', { name: /Official WhatsApp/i });
    fireEvent.click(whatsappBtn);

    // Top field replaces Business Email with WhatsApp Phone Number
    expect(screen.queryByLabelText(/Business Email Address/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/WhatsApp Phone Number/i)).toBeInTheDocument();
  });

  it('should validate invalid email and display error message', () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    const emailInput = screen.getByLabelText(/Business Email Address/i);
    const form = emailInput.closest('form');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(form);

    expect(screen.getByText(/Please enter a valid business email address/i)).toBeInTheDocument();
  });

  it('should validate invalid WhatsApp number when WhatsApp channel is selected', () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    const whatsappBtn = screen.getByRole('button', { name: /Official WhatsApp/i });
    fireEvent.click(whatsappBtn);

    const whatsappInput = screen.getByLabelText(/WhatsApp Phone Number/i);
    const form = whatsappInput.closest('form');

    fireEvent.change(whatsappInput, { target: { value: '12' } });
    fireEvent.submit(form);

    expect(screen.getByText(/Please enter a valid WhatsApp phone number/i)).toBeInTheDocument();
  });

  it('should handle honeypot bot protection silently', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    const emailInput = screen.getByLabelText(/Business Email Address/i);
    const hpInput = document.querySelector('input[name="website_hp"]');
    const submitBtn = screen.getByRole('button', { name: /Request Official Quote/i });

    fireEvent.change(emailInput, { target: { value: 'bot@spam.com' } });
    fireEvent.change(hpInput, { target: { value: 'spam bot payload' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received/i)).toBeInTheDocument();
    });
  });

  it('should handle direct email quotation submission to official desk without mailto popups', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    const emailInput = screen.getByLabelText(/Business Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Request Official Quote/i });

    fireEvent.change(emailInput, { target: { value: 'bench@jewelrystudio.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received! Email Sent Directly to Desk/i)).toBeInTheDocument();
      expect(screen.getByText(/bench@jewelrystudio.com/i)).toBeInTheDocument();
      expect(screen.getByTestId('direct-email-send-button')).toBeInTheDocument();
    });

    // Verify clicking "Send Direct Email to Desk" dispatches directly without mailto link popup
    const directEmailBtn = screen.getByTestId('direct-email-send-button');
    fireEvent.click(directEmailBtn);

    await waitFor(() => {
      expect(screen.getByTestId('direct-email-notice')).toBeInTheDocument();
    });
  });

  it('should handle direct WhatsApp quotation submission to official number', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    // Switch to WhatsApp channel
    const whatsappBtn = screen.getByRole('button', { name: /Official WhatsApp/i });
    fireEvent.click(whatsappBtn);

    const whatsappInput = screen.getByLabelText(/WhatsApp Phone Number/i);
    const submitBtn = screen.getByRole('button', { name: /Request Official Quote/i });

    fireEvent.change(whatsappInput, { target: { value: '+1 (555) 987-6543' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received/i)).toBeInTheDocument();
      expect(screen.getByText(/\+1 \(555\) 987-6543/i)).toBeInTheDocument();
      expect(screen.getAllByText((content) => content.includes('+91 90818 47956')).length).toBeGreaterThan(0);
    });
  });

  it('should allow user to submit another trade request after quote submission', async () => {
    render(
      <ShopProvider>
        <QuoteForm />
      </ShopProvider>
    );

    const emailInput = screen.getByLabelText(/Business Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Request Official Quote/i });

    fireEvent.change(emailInput, { target: { value: 'designer@customrings.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Quotation Request Received/i)).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole('button', { name: /Submit Another Quotation Request/i });
    fireEvent.click(resetBtn);

    expect(screen.getByLabelText(/Business Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Business Email Address/i).value).toBe('');
  });

  it('should accept initialCategory and initialSpecs props correctly', () => {
    render(
      <ShopProvider>
        <QuoteForm initialCategory="Lab-grown" initialSpecs="2.00ct Cushion, G-H VS1, IGI certified" />
      </ShopProvider>
    );

    const categorySelect = screen.getByLabelText(/Diamond Category/i);
    const messageArea = screen.getByLabelText(/Diamond Specifications & Requirements/i);

    expect(categorySelect.value).toBe('Lab-grown');
    expect(messageArea.value).toBe('2.00ct Cushion, G-H VS1, IGI certified');
  });
});
