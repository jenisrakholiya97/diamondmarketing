import React from 'react';
import { Header } from '../components/Header';

export default {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Primary brand navigation bar with direct sourcing desk badges, responsive mobile menu drawer, and fast official quote action trigger.',
      },
    },
  },
};

export const DesktopNavigation = {
  render: () => (
    <div className="w-full bg-[#0B0F17] min-h-[300px]">
      <Header />
      <div className="max-w-7xl mx-auto p-8 text-center text-slate-500 text-xs font-mono">
        Desktop Viewport &mdash; GIGAKELVIN Trade Header with full navigation tabs
      </div>
    </div>
  ),
};

export const MobileNavigation = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="w-full max-w-sm mx-auto bg-[#0B0F17] min-h-[400px] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <Header />
      <div className="p-6 text-center text-slate-400 text-xs">
        Click the hamburger menu on the right to toggle the mobile drawer.
      </div>
    </div>
  ),
};
