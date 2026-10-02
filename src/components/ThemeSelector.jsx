import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { THEME_COLORS } from '../data/tradeData';
export { THEME_COLORS };

export const ThemeSelector = () => {
  const { themeMode, setThemeMode } = useShop();

  const modeOptions = [
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div
      data-testid="theme-selector-container"
      className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-xl shadow-lg w-full sm:w-auto justify-center"
    >
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/80 p-1 rounded-lg w-full sm:w-auto justify-center">
        {modeOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = themeMode === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => setThemeMode(opt.mode)}
              title={`Theme Mode: ${opt.label}`}
              aria-label={`Switch to ${opt.label} theme`}
              className={`p-1.5 px-3 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 !text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={13} />
              <span className="text-[11px] uppercase tracking-wider">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
