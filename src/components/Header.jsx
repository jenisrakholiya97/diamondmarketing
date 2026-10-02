import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { downloadDemoQuote } from '../utils/downloadDemoQuote';
import { Menu, X, ArrowRight, Layers, Download } from 'lucide-react';

export const Header = () => {
  const { currentPath, navigate, openQuoteModal } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Supply', path: '/supply' },
    { label: 'Process', path: '/process' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2 cursor-pointer group shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center text-emerald-400 group-hover:border-emerald-500 transition shrink-0">
            <Layers size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-sans truncate">
                GIGAKELVIN
              </span>
              <span className="hidden min-[340px]:inline-block text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                TRADE
              </span>
            </div>
            <span className="hidden min-[480px]:block text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest -mt-0.5 font-mono truncate">
              Direct Sourcing Desk
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPath.split('?')[0] === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                data-active={isActive}
                className={`px-3 py-1.5 rounded-md text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${isActive
                  ? 'active-nav text-emerald-400 bg-slate-900 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 hover:border hover:border-slate-700'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA Buttons in Navbar (Desktop) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Demo Quote Download Button */}
          <button
            onClick={downloadDemoQuote}
            className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            title="Download B2B Lab-Grown Demo Quotation Sheet"
          >
            <Download size={14} />
            <span>Demo Quote</span>
          </button>

          {/* Request Quote Button */}
          <button
            onClick={() => openQuoteModal()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-emerald-950 transition cursor-pointer"
          >
            <span>Request Quote</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Actions & Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            onClick={downloadDemoQuote}
            className="hidden sm:flex px-2.5 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] uppercase font-semibold rounded-lg items-center gap-1 shrink-0"
            title="Download Demo Quote"
          >
            <Download size={12} />
            <span>Demo</span>
          </button>
          <button
            onClick={() => openQuoteModal()}
            className="hidden sm:flex px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] uppercase font-semibold rounded-lg shrink-0 items-center gap-1 shadow-sm"
          >
            <span>Quote</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 p-2 text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg flex items-center justify-center shrink-0 transition cursor-pointer shadow-sm"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} className="text-emerald-400" /> : <Menu size={20} className="text-slate-100" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F17] border-b border-slate-800 px-4 py-4 space-y-3 animate-fade-in">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                data-active={currentPath === item.path}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm uppercase tracking-wider font-semibold transition ${currentPath === item.path
                  ? 'active-nav text-emerald-400 bg-slate-900 border border-slate-700'
                  : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                downloadDemoQuote();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs uppercase font-semibold tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>Download Demo Quote</span>
            </button>

            <button
              onClick={() => {
                openQuoteModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-emerald-600 text-white text-xs uppercase font-semibold tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <span>Request Quote</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

