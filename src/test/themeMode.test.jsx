import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ShopProvider, useShop } from '../context/ShopContext';
import { ThemeSelector, THEME_COLORS } from '../components/ThemeSelector';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const ThemeTestConsumer = () => {
  const { themeMode, setThemeMode, themeColor, setThemeColor } = useShop();
  return (
    <div>
      <span data-testid="active-mode">{themeMode}</span>
      <span data-testid="active-color">{themeColor}</span>
      <button data-testid="btn-dark" onClick={() => setThemeMode('dark')}>Dark Mode</button>
      <button data-testid="btn-light" onClick={() => setThemeMode('light')}>Light Mode</button>
      <button data-testid="btn-system" onClick={() => setThemeMode('system')}>System Mode</button>
      <button data-testid="btn-color-luxe" onClick={() => setThemeColor('diamond-luxe')}>Diamond Luxe Color</button>
    </div>
  );
};

describe('Theme Mode & Single Default Color Setup Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme-color');
  });

  describe('Theme Mode (Dark, Light, System)', () => {
    it('should default to system mode and apply default attributes', () => {
      render(
        <ShopProvider>
          <ThemeTestConsumer />
        </ShopProvider>
      );

      expect(screen.getByTestId('active-mode')).toHaveTextContent('system');
    });

    it('should switch to dark mode, save to localStorage and apply dark class to html', async () => {
      render(
        <ShopProvider>
          <ThemeTestConsumer />
        </ShopProvider>
      );

      fireEvent.click(screen.getByTestId('btn-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('active-mode')).toHaveTextContent('dark');
        expect(localStorage.getItem('gk_trade_theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(false);
      });
    });

    it('should switch to light mode, save to localStorage and apply light class to html', async () => {
      render(
        <ShopProvider>
          <ThemeTestConsumer />
        </ShopProvider>
      );

      fireEvent.click(screen.getByTestId('btn-light'));

      await waitFor(() => {
        expect(screen.getByTestId('active-mode')).toHaveTextContent('light');
        expect(localStorage.getItem('gk_trade_theme')).toBe('light');
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });
  });

  describe('Single Default Theme Color Setup', () => {
    it('case 1: should default to diamond-luxe as the single available theme color', () => {
      render(
        <ShopProvider>
          <ThemeTestConsumer />
        </ShopProvider>
      );

      expect(THEME_COLORS.length).toBe(1);
      expect(THEME_COLORS[0].id).toBe('diamond-luxe');
      expect(screen.getByTestId('active-color')).toHaveTextContent('diamond-luxe');
      expect(document.documentElement.getAttribute('data-theme-color')).toBe('diamond-luxe');
    });

    it('case 2: should set and persist diamond-luxe theme color in localStorage', async () => {
      render(
        <ShopProvider>
          <ThemeTestConsumer />
        </ShopProvider>
      );

      fireEvent.click(screen.getByTestId('btn-color-luxe'));

      await waitFor(() => {
        expect(screen.getByTestId('active-color')).toHaveTextContent('diamond-luxe');
        expect(localStorage.getItem('gk_trade_theme_color')).toBe('diamond-luxe');
        expect(document.documentElement.getAttribute('data-theme-color')).toBe('diamond-luxe');
      });
    });
  });

  describe('ThemeSelector Component & Footer Integration', () => {
    it('should render ThemeSelector mode buttons (Dark, Light, System) cleanly', () => {
      render(
        <ShopProvider>
          <ThemeSelector />
        </ShopProvider>
      );

      expect(screen.getByRole('button', { name: /Switch to Dark theme/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Switch to Light theme/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Switch to System theme/i })).toBeInTheDocument();
    });

    it('should NOT render ThemeSelector in Header, but ONLY in Footer at bottom of site', () => {
      const { queryByRole: queryHeaderRole } = render(
        <ShopProvider>
          <Header />
        </ShopProvider>
      );
      expect(queryHeaderRole('button', { name: /Switch to Dark theme/i })).toBeNull();

      const { getByRole: getFooterRole } = render(
        <ShopProvider>
          <Footer />
        </ShopProvider>
      );
      expect(getFooterRole('button', { name: /Switch to Dark theme/i })).toBeInTheDocument();
      expect(screen.getByText(/Default Theme: Diamond Luxe/i)).toBeInTheDocument();
    });
  });
});
