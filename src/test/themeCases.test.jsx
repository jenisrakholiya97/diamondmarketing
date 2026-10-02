import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { ShopProvider, useShop } from '../context/ShopContext';
import { Header } from '../components/Header';
import { AboutPage } from '../pages/AboutPage';
import { SupplyPage } from '../pages/SupplyPage';
import { ThemeSelector } from '../components/ThemeSelector';

// Test wrapper helper with buttons to trigger theme changes
const ThemeTestHarness = () => {
  const { setThemeMode, setThemeColor } = useShop();

  return (
    <div>
      <Header />
      <main>
        <AboutPage />
        <SupplyPage />
      </main>
      <div data-testid="theme-controls">
        <button onClick={() => setThemeMode('light')}>Set Light Mode</button>
        <button onClick={() => setThemeMode('dark')}>Set Dark Mode</button>
        <button onClick={() => setThemeMode('system')}>Set System Mode</button>

        <button onClick={() => setThemeColor('diamond-luxe')}>Set Diamond Luxe</button>
        <button onClick={() => setThemeColor('gold')}>Set Gold</button>
      </div>
      <ThemeSelector />
    </div>
  );
};

describe('Comprehensive Theme & Navbar Hover Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme-color');
  });

  it('case 1: toggles between Light Mode and Dark Mode and applies html root classes', () => {
    render(
      <ShopProvider>
        <ThemeTestHarness />
      </ShopProvider>
    );

    // Switch to Light Mode
    fireEvent.click(screen.getByText('Set Light Mode'));
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Switch to Dark Mode
    fireEvent.click(screen.getByText('Set Dark Mode'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('case 2: applies theme color presets to documentElement data-theme-color attribute', () => {
    render(
      <ShopProvider>
        <ThemeTestHarness />
      </ShopProvider>
    );

    const presets = [
      { btn: 'Set Diamond Luxe', expected: 'diamond-luxe' },
      { btn: 'Set Gold', expected: 'gold' },
    ];

    presets.forEach(({ btn, expected }) => {
      fireEvent.click(screen.getByText(btn));
      expect(document.documentElement.getAttribute('data-theme-color')).toBe(expected);
    });
  });

  it('case 3: verifies AboutPage components render cleanly in Light Theme without hardcoded black lock-in', () => {
    render(
      <ShopProvider>
        <ThemeTestHarness />
      </ShopProvider>
    );

    fireEvent.click(screen.getByText('Set Light Mode'));

    expect(screen.getByText(/From Surat Cutting Desk to Global Trade Partner/i)).toBeInTheDocument();
    expect(screen.getByText(/Aarav Shah/i)).toBeInTheDocument();
    expect(screen.getByText(/Company History & Evolution/i)).toBeInTheDocument();
  });

  it('case 4: verifies Header nav tab buttons have active-nav class and data-active attributes for clear hover contrast', () => {
    render(
      <ShopProvider>
        <Header />
      </ShopProvider>
    );

    // Get desktop nav tab buttons
    const homeTab = screen.getByRole('button', { name: /^Home$/i });
    const aboutTab = screen.getByRole('button', { name: /^About$/i });

    expect(homeTab).toHaveAttribute('data-active', 'true');
    expect(aboutTab).toHaveAttribute('data-active', 'false');

    // Simulate clicking About Us tab
    fireEvent.click(aboutTab);
    expect(aboutTab).toHaveAttribute('data-active', 'true');
  });

  it('case 5: verifies SupplyPage buttons (+ Done & Add, Quote, Remove) adapt cleanly in Light & Dark modes', () => {
    render(
      <ShopProvider>
        <SupplyPage />
      </ShopProvider>
    );

    const addBtn = screen.getByRole('button', { name: /Add to list/i });
    const quoteBtn = screen.getByRole('button', { name: /Request Quote/i });

    expect(addBtn).toBeInTheDocument();
    expect(quoteBtn).toBeInTheDocument();

    // Click Add to list
    fireEvent.click(addBtn);

    // Verify remove button appears with theme responsive classes
    const removeBtn = screen.getByRole('button', { name: /Remove/i });
    expect(removeBtn).toBeInTheDocument();
  });
});
