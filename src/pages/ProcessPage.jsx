import { useShop } from '../context/ShopContext';
import { QuoteForm } from '../components/QuoteForm';
import { Clock, DollarSign, Truck, Video, ArrowRight } from 'lucide-react';

export const ProcessPage = () => {
  const { openQuoteModal, PROCESS_STEPS } = useShop();

  return (
    <div className="space-y-12 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
          Trade Sourcing Workflow
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
          A clear path from quote request to insured dispatch, designed for jewelers and custom studios.
        </p>
      </div>

      {/* 6 Step Visual Timeline */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROCESS_STEPS.map((item) => (
          <div
            key={item.step}
            className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-emerald-400">
                {item.step}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {item.timeframe}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Commercial Terms & SLA Card */}
      <section className="bg-[#0B131F] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Fulfillment
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Commercial Terms & SLA
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <Clock size={16} />
              <span>Response Window</span>
            </div>
            <p className="text-slate-300">
              Business-hour review for new trade inquiries and spec requests.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <DollarSign size={16} />
              <span>Payment Structure</span>
            </div>
            <p className="text-slate-300">
              Standard 50% deposit at selection, then balance before dispatch after final media approval.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <Video size={16} />
              <span>Pre-Ship Media</span>
            </div>
            <p className="text-slate-300">
              Full 360° HD macro video and certificate scan shared for buyer sign-off before shipment.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <Truck size={16} />
              <span>Transit Coverage</span>
            </div>
            <p className="text-slate-300">
              Insured door-to-door dispatch to the US, Canada, UK, and Australia.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => openQuoteModal()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition cursor-pointer"
          >
            <span>Start sourcing</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <QuoteForm />
    </div>
  );
};
