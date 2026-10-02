import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopProvider, useShop } from '../context/ShopContext';
import { QuoteModal } from '../components/QuoteModal';
import { QuoteForm } from '../components/QuoteForm';

const ThemeTestHarness = () => {
  const { setThemeMode, setThemeColor, themeMode, themeColor } = useShop();

  return (
    <div>
      <div data-testid="active-theme-mode">{themeMode}</div>
      <div data-testid="active-theme-color">{themeColor}</div>
      <button onClick={() => setThemeMode('light')}>Set Light</button>
      <button onClick={() => setThemeMode('dark')}>Set Dark</button>
      <button onClick={() => setThemeColor('diamond-luxe')}>Set Diamond Luxe</button>
      <button onClick={() => setThemeColor('gold')}>Set Gold</button>

      <QuoteModal />
      <QuoteForm isModal={false} />
    </div>
  );
};

describe('QuoteForm & QuoteModal Theme Adaptation Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme-color');
    window.scrollTo = vi.fn();
  });

  it('case 1: Download Spec Sheet button is theme-tinted and does not use hardcoded dark black bg', () => {
    render(
      <ShopProvider>
        <QuoteForm isModal={false} />
      </ShopProvider>
    );

    const specBtns = screen.getAllByRole('button', { name: /Download Spec Sheet/i });
    expect(specBtns.length).toBeGreaterThan(0);

    // Verify button contains theme-accent tint classes rather than hardcoded bg-slate-800
    specBtns.forEach((btn) => {
      expect(btn.className).toContain('bg-emerald-500/10');
      expect(btn.className).not.toContain('bg-slate-800');
    });
  });

  it('case 2: updates theme mode (light vs dark) and applies root attributes cleanly', () => {
    const { getByText, getByTestId } = render(
      <ShopProvider>
        <ThemeTestHarness />
      </ShopProvider>
    );

    fireEvent.click(getByText('Set Light'));
    expect(getByTestId('active-theme-mode').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);

    fireEvent.click(getByText('Set Dark'));
    expect(getByTestId('active-theme-mode').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('case 3: applies theme color presets (diamond-luxe, gold) to root data-theme-color', () => {
    const { getByText, getByTestId } = render(
      <ShopProvider>
        <ThemeTestHarness />
      </ShopProvider>
    );

    fireEvent.click(getByText('Set Diamond Luxe'));
    expect(getByTestId('active-theme-color').textContent).toBe('diamond-luxe');
    expect(document.documentElement.getAttribute('data-theme-color')).toBe('diamond-luxe');

    fireEvent.click(getByText('Set Gold'));
    expect(getByTestId('active-theme-color').textContent).toBe('gold');
    expect(document.documentElement.getAttribute('data-theme-color')).toBe('gold');
  });
});
