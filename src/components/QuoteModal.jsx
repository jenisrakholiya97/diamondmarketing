import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { QuoteForm } from './QuoteForm';
import { X } from 'lucide-react';

export const QuoteModal = () => {
  const { isQuoteModalOpen, closeQuoteModal, quotePrefill } = useShop();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeQuoteModal();
      }
    };
    if (isQuoteModalOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuoteModalOpen, closeQuoteModal]);

  if (!isQuoteModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10005] flex items-center justify-center p-3 sm:p-4 md:p-6 modal-backdrop-overlay animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeQuoteModal();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-xl lg:max-w-2xl max-h-[88vh] sm:max-h-[85vh] my-auto self-center flex flex-col bg-white dark:bg-[#0B131F] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* Sticky Modal Header Bar */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B131F] flex items-center justify-between shrink-0 rounded-t-2xl z-10 transition-colors">
          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block">
              B2B Loose Diamond Sourcing
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Request Official B2B Quotation
            </h3>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition shrink-0 ml-3 cursor-pointer"
            aria-label="Close quote modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          <QuoteForm
            initialCategory={quotePrefill?.category || 'Lab-grown'}
            initialSpecs={quotePrefill?.specs || ''}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
};

