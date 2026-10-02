import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShopProvider } from '../context/ShopContext';
import { Header } from '../components/Header';

describe('Sticky Header Navigation Component', () => {
  it('should render header with sticky top-0 position and z-50 layering for scrolling', () => {
    const { container } = render(
      <ShopProvider>
        <Header />
      </ShopProvider>
    );

    const headerElement = container.querySelector('header');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.className).toContain('sticky');
    expect(headerElement.className).toContain('top-0');
    expect(headerElement.className).toContain('z-50');
  });
});
