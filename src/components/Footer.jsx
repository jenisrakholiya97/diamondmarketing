import React from 'react';
import { useShop } from '../context/ShopContext';
import { ThemeSelector } from './ThemeSelector';
import { ShieldCheck, Mail, MessageSquare, MapPin, Lock, FileText } from 'lucide-react';

export const Footer = () => {
  const { SITE_CONFIG, navigate } = useShop();

  return (
    <footer className="bg-[#070A0F] border-t border-slate-800 text-slate-400 text-xs pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white font-sans tracking-tight">
              GIGAKELVIN
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
              TRADE
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Surat-direct loose diamonds for independent bench jewelers and custom design studios across the US, Canada, UK, and Australia.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <MapPin size={14} />
            <span>Sourcing Desk: Surat, Gujarat, India</span>
          </div>
        </div>

        {/* Quick Trade Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold mb-3 font-mono">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-emerald-400 transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/supply')} className="hover:text-emerald-400 transition">
                Supply
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/process')} className="hover:text-emerald-400 transition">
                Process
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/products')} className="hover:text-emerald-400 transition">
                Products
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-emerald-400 transition">
                About
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/faq')} className="hover:text-emerald-400 transition">
                FAQ
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition">
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Compliance & Standard Certifications */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold mb-3 font-mono">
            Certs & Compliance
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Lab-Grown: IGI Standard (GCAL 8X on request)</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Certified CVD & HPHT Manufacturing</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock size={14} className="text-emerald-400" />
              <span>100% Insured Door-to-Door Courier Delivery</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText size={14} className="text-emerald-400" />
              <span>USD Quotes • Pre-Shipment HD Media Approval</span>
            </li>
          </ul>
        </div>

        {/* Trade Direct Contacts */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold mb-3 font-mono">
            Direct Contact
          </h4>
          <div className="space-y-3">
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition"
            >
              <Mail size={14} className="text-emerald-400" />
              <span>{SITE_CONFIG.contactEmail}</span>
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition"
            >
              <MessageSquare size={14} className="text-emerald-400" />
              <span>WhatsApp: {SITE_CONFIG.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Dedicated Theme Controls Bar */}
      <div className="max-w-7xl mx-auto pt-6 pb-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400 text-center md:text-left">
          <span className="font-semibold text-slate-300 uppercase tracking-wider">Appearance & Theme Settings</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Default Theme: Diamond Luxe (#C8A96B) • Customize display mode (Dark / Light / System)</p>
        </div>
        <ThemeSelector />
      </div>

      {/* Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} {SITE_CONFIG.companyName}. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/privacy')} className="hover:text-slate-300 transition">
            Privacy Policy
          </button>
          <button onClick={() => navigate('/terms')} className="hover:text-slate-300 transition">
            Business Terms
          </button>
        </div>
      </div>
    </footer>
  );
};
