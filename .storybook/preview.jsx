import React from 'react';
import '../src/index.css';
import { ShopProvider } from '../src/context/ShopContext';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (_Story) => (
      <ShopProvider>
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased p-4 sm:p-6 selection:bg-emerald-500 selection:text-white">
          <_Story />
        </div>
      </ShopProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0B0F17' },
        { name: 'slate', value: '#0f172a' },
        { name: 'light', value: '#f8fafc' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;