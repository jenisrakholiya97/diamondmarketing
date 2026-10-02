import { useShop } from '../context/ShopContext';

export const TermsPage = () => {
  const { SITE_CONFIG } = useShop();

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-100 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          Trade Terms
        </span>
        <h1 className="text-3xl font-bold text-white mt-1">Business Terms & Conditions</h1>
        <p className="text-slate-400 text-xs mt-1">Updated for current trade sourcing arrangements.</p>
      </div>

      <div className="prose prose-invert prose-xs max-w-none space-y-4 text-slate-300 text-xs leading-relaxed font-sans">
        <p>
          These terms apply to B2B sourcing conversations, request-for-quote submissions, and any subsequent loose diamond purchase between the parties.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Order acceptance</h3>
        <p>
          Quotes are subject to available inventory, certification status, and final confirmation on the exact stone selected by the buyer.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Commercial terms</h3>
        <p>
          Standard trade terms require a 50% deposit upon stone selection and the remaining balance before final dispatch after final media and certificate verification.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Inspection & approval</h3>
        <p>
          Buyers may review the actual certificate scan and 360° HD media before approving the shipment. Approval is required before final dispatch occurs.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Shipping</h3>
        <p>
          Goods are shipped via insured commercial courier to the designated destination and are subject to the shipping and customs procedures applicable to international trade.
        </p>

        <h3 className="text-sm font-bold text-white uppercase font-mono mt-4">Contact</h3>
        <p>
          For direct trade questions, contact {SITE_CONFIG.contactEmail}.
        </p>
      </div>
    </div>
  );
};
