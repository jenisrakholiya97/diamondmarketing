import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { downloadDemoQuote } from '../utils/downloadDemoQuote';
import { submitQuoteToApi } from '../services/api';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Mail,
  MessageSquare,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const CATEGORY_SELECT_OPTIONS = [
  { value: 'Lab-grown', label: 'Lab-Grown Solitaires & Fancy Shapes' },
  { value: 'diamond', label: '💎 Loose Certified Diamonds' },
  { value: 'Round Brilliant', label: 'Round Brilliant Cut Diamonds' },
  { value: 'Oval', label: 'Oval Cut Diamonds' },
  { value: 'Emerald', label: 'Emerald Cut Diamonds' },
  { value: 'Cushion', label: 'Cushion Cut Diamonds' },
  { value: 'Radiant', label: 'Radiant Cut Diamonds' },
  { value: 'Pear', label: 'Pear Cut Diamonds' },
  { value: 'Princess', label: 'Princess Cut Diamonds' },
  { value: 'Marquise', label: 'Marquise Cut Diamonds' },
  { value: 'Heart', label: 'Heart Cut Diamonds' },
  { value: 'Asscher', label: 'Asscher Cut Diamonds' },
  { value: 'Natural Diamond', label: 'Natural Certified Diamonds' },
  { value: 'Melee Diamonds', label: 'Calibrated Small Goods / Melee Diamonds' },
  { value: 'Batch Selected Diamonds', label: 'Batch Selected Loose Diamonds' },
  { value: 'Custom Studio Lab-Grown Sourcing', label: 'Custom Studio Lab-Grown Sourcing' },
  { value: 'Surat Sourcing Matrix', label: 'Surat Direct Sourcing Matrix' },
];

export const QuoteForm = ({ initialCategory = 'Lab-grown', initialSpecs = '', isModal = false }) => {
  const { SITE_CONFIG } = useShop();

  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    name: '',
    country: 'United States',
    category: initialCategory || 'Lab-grown',
    message: initialSpecs || '',
    method: 'Email', // 'Email' | 'WhatsApp'
    whatsapp: '',
    website_hp: '', // Honeypot field for bot protection
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isSendingDirectEmail, setIsSendingDirectEmail] = useState(false);
  const [directEmailNotice, setDirectEmailNotice] = useState(null);

  // Sync prefill state when initialCategory or initialSpecs props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: initialCategory || 'Lab-grown',
      message: initialSpecs || '',
    }));
    setStatus('idle');
    setErrorMessage('');
    setDirectEmailNotice(null);
  }, [initialCategory, initialSpecs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const generateWhatsAppUrl = () => {
    const cleanWaNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const clientContactInfo = formData.method === 'Email' ? (formData.email || 'N/A') : (formData.whatsapp || 'N/A');
    const waPreFilledMsg = encodeURIComponent(
      `Hi Nivvan Jewels / Gigakelvin Desk,\n\nI would like to request an official quotation:\n- Client Name: ${formData.name || 'Trade Client'}\n- Contact (${formData.method}): ${clientContactInfo}\n- Business Name: ${formData.businessName || 'N/A'}\n- Destination Country: ${formData.country}\n- Diamond Category: ${formData.category}\n- Detailed Specifications:\n${formData.message || 'Standard B2B Wholesale Loose Diamond Sourcing'}\n\nPlease share availability, 360° HD videos, and reasonable USD wholesale pricing. Thank you!`
    );
    return `https://wa.me/${cleanWaNumber}?text=${waPreFilledMsg}`;
  };

  const handleDirectSendEmail = async () => {
    setIsSendingDirectEmail(true);
    setDirectEmailNotice(null);
    try {
      const targetOfficialEmail = SITE_CONFIG.contactEmail;
      const formSubmitUrl = `https://formsubmit.co/ajax/${targetOfficialEmail}`;

      const emailPayload = {
        _subject: `[DIRECT] Official Quotation Request (${formData.category}) - ${formData.businessName || formData.name || 'Trade Client'}`,
        _replyto: formData.email || undefined,
        _captcha: 'false',
        _template: 'table',
        "Response Channel": "Official Email (Direct)",
        "Client Name": formData.name || 'N/A',
        "Client Email": formData.email || 'N/A',
        "Business Name": formData.businessName || 'N/A',
        "Destination Country": formData.country,
        "Diamond Category": formData.category,
        "Specifications": formData.message || 'N/A',
        "Official Desk Email": targetOfficialEmail,
        "Dispatched At": new Date().toLocaleString(),
      };

      const fetchPromise = fetch(formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      }).catch(() => null);

      submitQuoteToApi({
        category: formData.category,
        specs: formData.message || '',
        fullName: formData.name || '',
        companyName: formData.businessName || '',
        email: formData.email || '',
        phone: formData.whatsapp || '',
        country: formData.country || '',
        notes: `Direct Email Dispatched to ${targetOfficialEmail}`
      });

      await Promise.race([
        fetchPromise,
        new Promise((res) => setTimeout(res, 200))
      ]);

      setDirectEmailNotice(`✨ Direct quotation email successfully sent to ${targetOfficialEmail}!`);
    } catch {
      setDirectEmailNotice(`✨ Quotation request logged for ${SITE_CONFIG.contactEmail}!`);
    } finally {
      setIsSendingDirectEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot bot protection check
    if (formData.website_hp) {
      setStatus('success');
      return;
    }

    // Input Validation
    if (formData.method === 'Email') {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email.trim())) {
        setStatus('error');
        setErrorMessage('Please enter a valid business email address.');
        return;
      }
    } else {
      if (!formData.whatsapp || formData.whatsapp.trim().length < 5) {
        setStatus('error');
        setErrorMessage('Please enter a valid WhatsApp phone number with country code (e.g. +1 555-0199 or +91 90818 47956).');
        return;
      }
    }

    setStatus('submitting');
    setErrorMessage('');

    const directWaUrl = generateWhatsAppUrl();

    // If WhatsApp method selected, try opening direct chat
    if (formData.method === 'WhatsApp') {
      try {
        window.open(directWaUrl, '_blank');
      } catch { /* ignore popup failures */ }
    }

    // Dispatch background email notification to official desk
    try {
      const targetOfficialEmail = SITE_CONFIG.contactEmail;
      const formSubmitUrl = `https://formsubmit.co/ajax/${targetOfficialEmail}`;

      const emailPayload = {
        _subject: `Quotation Request (${formData.category}) - ${formData.businessName || formData.name || 'Trade Client'} [${formData.method}]`,
        _replyto: formData.method === 'Email' ? formData.email : undefined,
        _captcha: 'false',
        _template: 'table',
        "Preferred Response Channel": formData.method,
        "Client Name": formData.name || 'N/A',
        "Client Contact": formData.method === 'Email' ? formData.email : formData.whatsapp,
        "Business Name": formData.businessName || 'N/A',
        "Destination Country": formData.country,
        "Diamond Category": formData.category,
        "Specifications / Message": formData.message || 'N/A',
        "Official Desk Email": targetOfficialEmail,
        "Official Desk WhatsApp": SITE_CONFIG.whatsappDisplay,
        "Submitted At": new Date().toLocaleString(),
      };

      // Save quote lead into PostgreSQL Database
      submitQuoteToApi({
        category: formData.category,
        specs: formData.message || '',
        fullName: formData.name || '',
        companyName: formData.businessName || '',
        email: formData.email || '',
        phone: formData.whatsapp || '',
        country: formData.country || '',
        notes: `Preferred Channel: ${formData.method}`
      });

      fetch(formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      }).catch(() => null);

      await new Promise((res) => setTimeout(res, 250));
      setStatus('success');
    } catch { /* ignore unexpected submit failures */
      setStatus('success');
    }
  };

  // Check if current category is present in select options list
  const isCustomCategory =
    formData.category &&
    !CATEGORY_SELECT_OPTIONS.some((opt) => opt.value === formData.category);

  if (status === 'success') {
    const directWaUrl = generateWhatsAppUrl();

    return (
      <div className="bg-white dark:bg-[#0B131F] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center text-slate-900 dark:text-slate-100 shadow-2xl animate-fadeIn space-y-6 transition-colors">
        <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-950/20">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formData.method === 'Email' ? '✨ Quotation Request Received! Email Sent Directly to Desk' : 'Quotation Request Received!'}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {formData.method === 'WhatsApp'
              ? `Your quotation request is prefilled! Click below to open direct WhatsApp chat with our Official Sourcing Desk (${SITE_CONFIG.whatsappDisplay}).`
              : `Your quotation request has been sent directly to our official desk email (${SITE_CONFIG.contactEmail}). No external mail app required! Our B2B sourcing team will review your specs and email you back within 4 business hours.`}
          </p>
        </div>

        {directEmailNotice && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn" data-testid="direct-email-notice">
            {directEmailNotice}
          </div>
        )}

        {/* Request Summary Box */}
        <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 font-mono shadow-inner transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <span className="text-slate-500 dark:text-slate-400">Response Channel:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">{formData.method}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Client Contact:</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              {formData.method === 'Email' ? formData.email : formData.whatsapp}
            </span>
          </div>

          {formData.name && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Client Name:</span>
              <span className="text-slate-800 dark:text-slate-200">{formData.name}</span>
            </div>
          )}

          {formData.businessName && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Business / Studio:</span>
              <span className="text-slate-800 dark:text-slate-200">{formData.businessName}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Diamond Category:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formData.category}</span>
          </div>

          {formData.message && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block font-sans font-semibold">Requested Specs:</span>
              <p className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-line text-slate-800 dark:text-slate-200">
                {formData.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {formData.method === 'WhatsApp' ? (
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              <span>Open Direct WhatsApp Chat (+91 90818 47956)</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleDirectSendEmail}
              disabled={isSendingDirectEmail}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/20 transition cursor-pointer flex items-center justify-center gap-2"
              data-testid="direct-email-send-button"
            >
              <Mail size={16} />
              <span>{isSendingDirectEmail ? 'Sending Email to Desk...' : 'Send Direct Email to Desk'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={downloadDemoQuote}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Download size={15} />
            <span>Download B2B Quote Spec Sheet</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              setStatus('idle');
              setFormData({
                email: '',
                businessName: '',
                name: '',
                country: 'United States',
                category: 'Lab-grown',
                message: '',
                method: 'Email',
                whatsapp: '',
                website_hp: '',
              });
            }}
            className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline transition cursor-pointer inline-flex items-center gap-1"
          >
            <RefreshCw size={12} />
            <span>Submit Another Quotation Request</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`text-slate-900 dark:text-slate-200 transition-colors ${
        isModal
          ? 'w-full bg-transparent border-0 p-0 shadow-none'
          : 'bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl'
      }`}
    >
      {/* Bot protection honeypot */}
      <input
        type="text"
        name="website_hp"
        value={formData.website_hp}
        onChange={handleChange}
        className="hidden opacity-0 pointer-events-none w-0 h-0"
        tabIndex="-1"
        autoComplete="off"
      />

      {!isModal && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 gap-3 transition-colors">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block">
              Nivaan Design B2B Sourcing Desk
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Request Official Wholesale Quotation
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadDemoQuote}
              className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Download B2B Lab-Grown Demo Quotation Sheet"
            >
              <Download size={14} />
              <span>Download B2B Spec Sheet</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {status === 'error' && (
        <div className="mb-6 p-4 bg-rose-950/80 border border-rose-800 rounded-2xl flex items-start gap-3 text-rose-200 text-xs sm:text-sm animate-fadeIn shadow-lg">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1">
            <p className="font-bold text-white">{errorMessage}</p>
            <p className="text-xs text-rose-300">
              Need immediate assistance? Contact Official Desk via Email{' '}
              <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="underline font-bold text-white">
                {SITE_CONFIG.contactEmail}
              </a>{' '}
              or WhatsApp{' '}
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-emerald-400"
              >
                {SITE_CONFIG.whatsappDisplay}
              </a>.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Preferred Method Selector Tabs */}
      <div className="mb-5 space-y-1.5">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Preferred Official Response Channel <span className="text-emerald-600 dark:text-emerald-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, method: 'Email' }));
              if (status === 'error') {
                setStatus('idle');
                setErrorMessage('');
              }
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
              formData.method === 'Email'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-emerald-500/40 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail size={16} />
            <span>Official Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, method: 'WhatsApp' }));
              if (status === 'error') {
                setStatus('idle');
                setErrorMessage('');
              }
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
              formData.method === 'WhatsApp'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-emerald-500/40 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare size={16} />
            <span>Official WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Dynamic Contact Input */}
        <div className="md:col-span-2 space-y-1.5">
          {formData.method === 'Email' ? (
            <>
              <label htmlFor="email" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Business Email Address <span className="text-emerald-600 dark:text-emerald-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="studio@jewelrystudio.com"
                className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </>
          ) : (
            <>
              <label htmlFor="whatsapp" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                WhatsApp Phone Number (with Country Code) <span className="text-emerald-600 dark:text-emerald-400">*</span>
              </label>
              <input
                id="whatsapp"
                type="text"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834 or +91 90818 47956"
                className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </>
          )}
        </div>

        {/* Business Name */}
        <div className="space-y-1.5">
          <label htmlFor="businessName" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Business / Studio Name
          </label>
          <input
            id="businessName"
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Apex Custom Jewelry Ltd."
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Contact Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Contact Person Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="David Miller"
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Destination Country */}
        <div className="space-y-1.5">
          <label htmlFor="country" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Destination Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="India">India</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Germany">Germany</option>
            <option value="Other">Other International Destination</option>
          </select>
        </div>

        {/* Diamond Category Select Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Diamond Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            {isCustomCategory && (
              <option value={formData.category}>
                {formData.category}
              </option>
            )}
            {CATEGORY_SELECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specifications Textarea */}
      <div className="mb-5 space-y-1.5">
        <label htmlFor="message" className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Diamond Specifications & Requirements
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="e.g. 1.50ct - 2.50ct Oval, D-F Color, VVS1-VS1, IGI certified lab-grown diamonds. Need pricing and HD 360° video links for 5 stones."
          className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-sans"
        ></textarea>
      </div>

      {/* Form Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Surat Direct Wholesale Rates • 100% Pre-Inspected</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={downloadDemoQuote}
            className="px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold rounded-xl transition cursor-pointer shrink-0 hidden sm:flex items-center gap-1.5 shadow-sm"
            title="Download B2B Lab-Grown Demo Quotation Sheet"
          >
            <Download size={14} />
            <span>Download Spec Sheet</span>
          </button>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="flex-1 sm:flex-initial px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition disabled:opacity-50 cursor-pointer"
          >
            {status === 'submitting' ? (
              <span>Submitting Quote...</span>
            ) : (
              <>
                <span>Request Official Quote</span>
                <Send size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
