import React, { useEffect } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

export const DeleteProductModal = ({ isOpen, diamond, onClose, onConfirm }) => {
  useEffect(() => {
    if (!isOpen) return;

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isOpen, onClose]);

  if (!isOpen || !diamond) return null;

  const displayTitle = diamond.title || `${diamond.carat || ''} ${diamond.shape || ''} Certified Diamond`.trim();

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 modal-backdrop-overlay animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      data-testid="delete-confirm-modal-overlay"
    >
      <div
        className="bg-white dark:bg-[#0B131F] border border-rose-500/30 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 relative animate-scaleUp my-auto self-center max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        data-testid="delete-confirm-modal-content"
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
          data-testid="cancel-delete-modal-button"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Warning Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-inner">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              Delete Certified Diamond
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
              <AlertTriangle size={12} />
              <span>This action cannot be undone</span>
            </p>
          </div>
        </div>

        {/* Product Details Box */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
            {displayTitle}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
            {diamond.shape && (
              <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-lg font-semibold">
                {diamond.shape}
              </span>
            )}
            {diamond.carat && (
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg font-semibold">
                {diamond.carat}
              </span>
            )}
            {(diamond.color || diamond.clarity) && (
              <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-lg">
                {[diamond.color, diamond.clarity].filter(Boolean).join(' / ')}
              </span>
            )}
          </div>
          {(diamond.certNumber || diamond.id) && (
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-1">
              Ref #: {diamond.certNumber || diamond.id}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Are you sure you want to permanently remove this product from your catalog and database storage?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-2xl transition cursor-pointer text-center"
            data-testid="cancel-delete-confirm-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            data-testid="confirm-delete-modal-button"
          >
            <Trash2 size={14} />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
