import { useShop } from '../context/ShopContext';

export const PrivacyPage = () => {
  const { SITE_CONFIG } = useShop();

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-100 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          Compliance
        </span>
        <h1 className="text-3xl font-bold text-white mt-1">Privacy Policy</h1>
        <p className="text-slate-400 text-xs mt-1">Updated for current trade inquiry and sourcing practices.</p>
      </div>

      <div className="prose prose-invert prose-xs max-w-none space-y-4 text-slate-300 text-xs leading-relaxed font-sans">
        <p>
          We collect only the information necessary to handle trade inquiries, evaluate diamond specifications, and coordinate sourcing and shipping.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Information we collect</h3>
        <p>
          This may include your name, business details, email address, WhatsApp number, order requirements, and any stone specifications you provide for a quote request.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">How we use it</h3>
        <p>
          The information is used to prepare quotations, confirm trade eligibility, coordinate product sourcing, and manage follow-up communication for any approved order.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Data retention</h3>
        <p>
          Communication records and inquiry details are retained only as long as needed to support the trade relationship, document the order, and meet business or legal obligations.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Contact</h3>
        <p>
          If you have questions about this policy, contact us at <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-emerald-400 underline">{SITE_CONFIG.contactEmail}</a>.
        </p>
      </div>
    </div>
  );
};
