import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, onSubmitReview }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Master Goldsmith / Bench Jeweler');
  const [studio, setStudio] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Lab-Grown');
  const [stoneSpec, setStoneSpec] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [opticsScore, setOpticsScore] = useState(5);
  const [videoScore, setVideoScore] = useState(5);
  const [deliveryScore, setDeliveryScore] = useState(5);
  const [pricingScore, setPricingScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author || !studio || !content) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview = {
        id: `rev-${Date.now()}`,
        author: author.trim(),
        role: role.trim() || 'Bench Jeweler',
        studio: studio.trim(),
        location: location.trim() || 'Verified Trade Client',
        flag: location.toLowerCase().includes('uk') || location.toLowerCase().includes('london') ? '🇬🇧' :
          location.toLowerCase().includes('canada') || location.toLowerCase().includes('toronto') ? '🇨🇦' :
            location.toLowerCase().includes('australia') || location.toLowerCase().includes('sydney') ? '🇦🇺' : '🇺🇸',
        rating,
        date: new Date().toISOString().split('T')[0],
        verified: true,
        stoneSpec: stoneSpec.trim() || `${category} Loose Diamond Spec`,
        category,
        metrics: {
          optics: opticsScore,
          videoAccuracy: videoScore,
          delivery: deliveryScore,
          pricing: pricingScore,
        },
        title: title.trim() || 'Verified Surat Sourcing Experience',
        content: content.trim(),
        helpfulCount: 1,
      };

      onSubmitReview(newReview);
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        // Reset form
        setAuthor('');
        setStudio('');
        setLocation('');
        setStoneSpec('');
        setTitle('');
        setContent('');
      }, 1500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 modal-backdrop-overlay animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="bg-[#0B131F] border border-slate-800 w-full max-w-xl lg:max-w-2xl rounded-2xl shadow-2xl relative text-slate-100 flex flex-col max-h-[88vh] sm:max-h-[85vh] my-auto self-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* Sticky Modal Header Bar */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-800 bg-[#0B131F] flex items-start justify-between shrink-0 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Verified Trade Client Review</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Submit Surat Loose Diamond Sourcing Review
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Share your verified experience sourcing certified lab-grown loose diamonds from our Surat desk with independent bench jewelers worldwide.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition shrink-0 ml-3"
            aria-label="Close review modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Trade Review Submitted!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you for sharing your verified Surat sourcing experience. Your feedback helps independent bench jewelers worldwide.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Overall Rating Stars */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                  Overall Satisfaction Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={`${(hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                          }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-amber-400 font-mono">
                    {rating}.0 / 5.0 Stars
                  </span>
                </div>
              </div>

              {/* Detailed Category Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <label className="text-[11px] text-slate-400 block font-mono">Optics & Fire</label>
                  <select
                    value={opticsScore}
                    onChange={(e) => setOpticsScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s}.0 ★</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <label className="text-[11px] text-slate-400 block font-mono">360° HD Video</label>
                  <select
                    value={videoScore}
                    onChange={(e) => setVideoScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s}.0 ★</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <label className="text-[11px] text-slate-400 block font-mono">Transit Speed</label>
                  <select
                    value={deliveryScore}
                    onChange={(e) => setDeliveryScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s}.0 ★</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <label className="text-[11px] text-slate-400 block font-mono">Surat Price</label>
                  <select
                    value={pricingScore}
                    onChange={(e) => setPricingScore(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>{s}.0 ★</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                    Studio / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance Custom Jewelry Atelier"
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master Goldsmith / Owner"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                    City & Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New York, NY, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Stone Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                    Category Sourced
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Lab-Grown">Lab-Grown (IGI Certified)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                    Stone Spec Details (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2.50ct Oval IGI VVS1 D-Color"
                    value={stoneSpec}
                    onChange={(e) => setStoneSpec(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Review Title & Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your experience in one sentence"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                  Detailed Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe stone optics, loupe inspection match, pre-shipment HD video accuracy, and insured delivery experience..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Publishing Review...' : 'Submit Trade Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
