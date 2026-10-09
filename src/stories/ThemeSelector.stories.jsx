import React from 'react';
import { ThemeSelector } from '../components/ThemeSelector';

export default {
  title: 'Layout/ThemeSelector',
  component: ThemeSelector,
  parameters: {
    docs: {
      description: {
        component: 'Multi-mode visual theme switcher supporting Dark, Light, and System preferences.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Theme Switcher Control</h3>
        <p className="text-xs text-slate-400">Toggle between Dark, Light, and System modes</p>
      </div>
      <ThemeSelector />
    </div>
  ),
};

export const InLightContainer = {
  render: () => (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-2xl border border-slate-300 space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-mono text-slate-800 uppercase tracking-widest font-semibold">Light Container Preview</h3>
        <p className="text-xs text-slate-600">Simulating appearance when placed inside light surfaces</p>
      </div>
      <ThemeSelector />
    </div>
  ),
};
