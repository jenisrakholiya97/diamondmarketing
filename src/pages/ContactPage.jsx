import { useShop } from '../context/ShopContext';
import { QuoteForm } from '../components/QuoteForm';
import { Mail, MessageSquare, Clock } from 'lucide-react';

export const ContactPage = () => {
  const { SITE_CONFIG } = useShop();

  return (
    <div className="space-y-12 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          Contact
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
          Start a sourcing conversation
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
          Share your requirements and receive direct trade support from the Surat sourcing desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Contacts */}
        <div className="space-y-6">
          <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Direct Communication
            </h3>

            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="flex items-start gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-emerald-500/50 transition group"
            >
              <Mail size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Trade Email</span>
                <span className="text-xs text-white font-medium group-hover:text-emerald-400 transition">
                  {SITE_CONFIG.contactEmail}
                </span>
              </div>
            </a>

            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-emerald-500/50 transition group"
            >
              <MessageSquare size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">WhatsApp</span>
                <span className="text-xs text-white font-medium group-hover:text-emerald-400 transition">
                  {SITE_CONFIG.whatsappDisplay}
                </span>
              </div>
            </a>
          </div>

          <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
              <Clock size={16} />
              <span>Response SLA</span>
            </div>
            <p className="text-slate-300">
              Most requests are reviewed within the same business day.
            </p>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Sourcing Desk: Surat, Gujarat, India
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Quote Form */}
        <div className="lg:col-span-2">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
};
