import React from 'react';
import { QuoteModal } from '../components/QuoteModal';
import { useShop } from '../context/ShopContext';

export default {
  title: 'Modals/QuoteModal',
  component: QuoteModal,
  parameters: {
    docs: {
      description: {
        component: 'Popup modal providing fast quotation submission for buyers with backdrop overlay and escape-key dismissal.',
      },
    },
  },
};

const QuoteModalWrapper = ({ prefillCategory, prefillSpecs }) => {
  const { openQuoteModal } = useShop();

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-950/60">
      <div className="text-center mb-6">
        <h4 className="text-base font-bold text-white mb-1">Interactive Quote Modal Trigger</h4>
        <p className="text-xs text-slate-400">Click below to test the full interactive modal overlay and ESC keyboard capture</p>
      </div>
      <button
        onClick={() => openQuoteModal(prefillCategory, prefillSpecs)}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50 cursor-pointer"
      >
        Open B2B Quotation Modal
      </button>
      <QuoteModal />
    </div>
  );
};

export const InteractiveTrigger = {
  render: () => <QuoteModalWrapper prefillCategory="Lab-grown" prefillSpecs="1.50 Ct Round Brilliant D VVS1 | CERT-77440695" />,
};

export const CustomDiamondPrefill = {
  render: () => <QuoteModalWrapper prefillCategory="Lab-grown" prefillSpecs="Custom Diamond Inquired: 2.20 Ct Oval E VS1" />,
};
