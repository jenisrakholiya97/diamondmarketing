import React, { useEffect } from 'react';
import { AlertTriangle, X, ArrowLeft, Trash2 } from 'lucide-react';

export const UnsavedChangesModal = ({ isOpen, onClose, onConfirm }) => {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 modal-backdrop-overlay animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      data-testid="unsaved-changes-modal-overlay"
    >
      <div
        className="bg-white dark:bg-[#0B131F] border border-amber-500/40 dark:border-amber-700/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 relative animate-scaleUp my-auto self-center max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        data-testid="unsaved-changes-modal-content"
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
          data-testid="close-unsaved-modal-button"
          aria-label="Keep editing"
        >
          <X size={18} />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              Unsaved Changes Detected
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
              <span>Exit Confirmation Modal</span>
            </p>
          </div>
        </div>

        {/* Message body */}
        <div className="bg-amber-500/5 border border-amber-500/20 dark:bg-amber-950/20 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          You have unsaved changes on this product. Are you sure you want to discard your changes and exit without saving?
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            data-testid="keep-editing-button"
          >
            <ArrowLeft size={14} />
            <span>Keep Editing</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
            data-testid="discard-changes-button"
          >
            <Trash2 size={14} />
            <span>Discard Changes & Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
