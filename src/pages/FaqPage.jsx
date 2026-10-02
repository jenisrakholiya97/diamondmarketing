import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronDown } from 'lucide-react';

export const FaqPage = () => {
  const { FAQ_ITEMS, openQuoteModal } = useShop();
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          FAQ
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
          Trade FAQ
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
          Answers to the most common questions before a sourcing order is placed.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={`${item.question}-${index}`}
              className="bg-[#0B131F] border border-slate-800 rounded-xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-emerald-400 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
                  <span className="text-xs font-mono text-emerald-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shrink-0">
                    {item.category}
                  </span>
                  <span>{item.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 font-sans">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Prompt */}
      <div className="bg-[#0B131F] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            Need a custom sourcing brief?
          </h3>
          <p className="text-slate-400">
            Send your cut, quantity, and delivery window for a direct quote.
          </p>
        </div>
        <button
          onClick={() => openQuoteModal()}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg shrink-0 transition cursor-pointer"
        >
          Ask the desk
        </button>
      </div>
    </div>
  );
};
