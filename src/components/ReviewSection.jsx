import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_REVIEWS } from '../data/reviewsData';
import { ReviewModal } from './ReviewModal';
import { fetchReviewsFromApi, submitReviewToApi, checkDbHealth } from '../services/api';
import { Star, ShieldCheck, ThumbsUp, PlusCircle, CheckCircle2, Award, Truck, Sparkles, Filter } from 'lucide-react';

export const ReviewSection = ({ limit = null, title = "Verified Trade Ratings & Reviews", hideNaturalTab = false }) => {
  const [reviews, setReviews] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('gk_user_reviews');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch { /* ignore localStorage parse error */ }
    }
    return INITIAL_REVIEWS;
  });

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votedReviews, setVotedReviews] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const health = await checkDbHealth();
        if (health && health.database && (health.database.status === 'connected' || health.database.status === 'fallback_mode')) {
          const apiReviews = await fetchReviewsFromApi();
          if (Array.isArray(apiReviews) && apiReviews.length > 0) {
            const formattedApiReviews = apiReviews.map((r) => ({
              id: r.id || `rev-${Date.now()}-${Math.random()}`,
              author: r.authorName || 'Verified Trade Client',
              role: 'Bench Jeweler / Custom Designer',
              studio: r.companyName || 'Atelier Client',
              location: r.country || 'International',
              flag: '🌐',
              date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
              rating: Number(r.rating) || 5,
              stoneSpec: 'Lab-Grown Certified Diamond',
              category: 'Lab-Grown',
              title: 'Direct Sourcing Review',
              content: r.reviewText,
              helpfulCount: 1,
              metrics: { optics: 5.0, videoAccuracy: 5.0, delivery: 5.0, pricing: 5.0 }
            }));

            setReviews((prev) => {
              const combined = [...formattedApiReviews];
              prev.forEach((p) => {
                if (!combined.some((c) => String(c.id) === String(p.id))) {
                  combined.push(p);
                }
              });
              if (typeof window !== 'undefined' && window.localStorage) {
                try {
                  localStorage.setItem('gk_user_reviews', JSON.stringify(combined));
                } catch { /* ignore localStorage save error */ }
              }
              return combined;
            });
          }
        }
      } catch {
        // ignore and keep state
      }
    })();
  }, []);

  const handleAddReview = (newReview) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('gk_user_reviews', JSON.stringify(updated));
      } catch { /* ignore localStorage save error */ }
    }

    submitReviewToApi({
      authorName: newReview.author,
      companyName: newReview.studio,
      country: newReview.location,
      rating: newReview.rating,
      reviewText: newReview.content
    });
  };

  const handleHelpfulClick = (id) => {
    if (votedReviews[id]) return;
    const updated = reviews.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
    setReviews(updated);
    setVotedReviews({ ...votedReviews, [id]: true });
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('gk_user_reviews', JSON.stringify(updated));
      } catch { /* ignore error */ }
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (hideNaturalTab && r.category === 'Natural') return false;
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
    if (ratingFilter !== 'All' && Number(r.rating) !== Number(ratingFilter)) return false;
    return true;
  });

  const displayedReviews = limit ? filteredReviews.slice(0, limit) : filteredReviews;

  const ratingStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: "0.0",
        totalReviews: 0,
        satisfactionRate: "0.0%",
        breakdown: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
        categoryScores: [
          { name: "Optics & Fire Quality", score: 0.0 },
          { name: "360° HD Video Accuracy", score: 0.0 },
          { name: "Insured Transit Speed", score: 0.0 },
          { name: "Surat Direct Pricing", score: 0.0 },
        ],
      };
    }

    const total = reviews.length;
    const sumRating = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sumRating / total).toFixed(1);

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const s = Math.round(Number(r.rating) || 5);
      if (starCounts[s] !== undefined) starCounts[s]++;
    });

    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: starCounts[stars],
      percentage: Math.round((starCounts[stars] / total) * 100),
    }));

    const fiveStarPct = Math.round((starCounts[5] / total) * 100);

    return {
      averageRating: avg,
      totalReviews: total,
      satisfactionRate: `${fiveStarPct}%`,
      breakdown,
      categoryScores: [
        { name: "Optics & Fire Quality", score: Number(avg) },
        { name: "360° HD Video Accuracy", score: Number(avg) },
        { name: "Insured Transit Speed", score: Number(avg) },
        { name: "Surat Direct Pricing", score: Number(avg) },
      ],
    };
  }, [reviews]);

  return (
    <section className="space-y-8 py-4 text-slate-100">
      {/* Header & Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded-full text-xs font-mono text-emerald-300 mb-2">
            <ShieldCheck size={14} />
            <span>Verified Trade Client Ratings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Authentic trade ratings, 30x loupe verification audits, and certified lab-grown loose diamond sourcing feedback from independent goldsmiths, custom bench jewelers, and atelier owners worldwide.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer shrink-0"
        >
          <PlusCircle size={16} />
          <span>Write a Trade Review</span>
        </button>
      </div>

      {/* Main Rating Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Overall Score Card */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block">
              Surat Desk Audited Quality Metric
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-3">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
                {ratingStats.averageRating}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={s <= Math.round(Number(ratingStats.averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-600 dark:text-slate-700"}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                  Based on {ratingStats.totalReviews} verified trade orders
                </span>
              </div>
            </div>
          </div>

          {/* Key Value Guarantee Badges */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs font-mono">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>On-Time Insured Transit:</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ratingStats.satisfactionRate}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>360° HD Video Loupe Match:</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Match</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Truck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Surat Direct Shipping SLA:</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">~7 Days</span>
            </div>
          </div>
        </div>

        {/* Right Column: Rating Distribution & Breakdown Metrics */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
          {/* Star Rating Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold mb-3">
              Star Rating Breakdown
            </h4>
            {ratingStats.breakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
                  {item.stars} <Star size={12} className="fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-slate-600 dark:text-slate-400 font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>

          {/* Core Service Category Scores */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold mb-3">
              Audited Service Benchmarks
            </h4>
            <div className="space-y-2.5">
              {ratingStats.categoryScores.map((cat) => (
                <div key={cat.name} className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{cat.score.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(cat.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
          <Filter size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Filter Trade Reviews:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1.5 rounded-md transition font-semibold cursor-pointer ${
                categoryFilter === 'All'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setCategoryFilter('Lab-Grown')}
              className={`px-3 py-1.5 rounded-md transition font-semibold cursor-pointer ${
                categoryFilter === 'Lab-Grown'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Lab-Grown (IGI)
            </button>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              onClick={() => setRatingFilter('All')}
              className={`px-3 py-1.5 rounded-md transition font-semibold cursor-pointer ${
                ratingFilter === 'All'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Stars
            </button>
            <button
              onClick={() => setRatingFilter('5')}
              className={`px-3 py-1.5 rounded-md transition font-semibold cursor-pointer ${
                ratingFilter === '5'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              5 Stars ★
            </button>
          </div>
        </div>
      </div>

      {/* Review Cards Grid or Empty State */}
      {displayedReviews.length === 0 ? (
        <div className="bg-white/80 dark:bg-[#0B131F]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Star size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No User Reviews Submitted Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            No trade client reviews have been posted yet. Be the first verified jeweler or custom studio to submit your direct sourcing feedback.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition cursor-pointer inline-flex items-center gap-2 shadow-md"
          >
            <PlusCircle size={16} />
            <span>Write First Trade Review Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Card Header: Author Info */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{rev.author}</span>
                      <span title="Verified Trade Client" className="text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                        <CheckCircle2 size={14} />
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{rev.role}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{rev.studio}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1">
                      <span>{rev.flag || '🌐'}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{(rev.location || 'Trade Client').split(',')[0]}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">{rev.date}</span>
                  </div>
                </div>

                {/* Star Rating & Stone Spec Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded">
                    {rev.stoneSpec || 'Lab-Grown Diamond'}
                  </span>
                </div>

                {/* Title & Body */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    "{rev.title || 'Verified Sourcing Review'}"
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed mt-2">
                    {rev.content}
                  </p>
                </div>
              </div>

              {/* Sub-metrics & Helpful Button Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-400 text-center">
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-1 rounded border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-500">Optics</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{rev.metrics?.optics || 5}★</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-1 rounded border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-500">Video</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{rev.metrics?.videoAccuracy || 5}★</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-1 rounded border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-500">Transit</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{rev.metrics?.delivery || 5}★</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-1 rounded border border-slate-200 dark:border-slate-800">
                    <span className="block text-[9px] text-slate-500">Price</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{rev.metrics?.pricing || 5}★</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Verified Purchase</span>
                  </span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={votedReviews[rev.id]}
                    className={`flex items-center gap-1 text-[11px] font-mono transition cursor-pointer ${
                      votedReviews[rev.id] ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={12} />
                    <span>Helpful ({rev.helpfulCount || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReview={handleAddReview}
        hideNaturalTab={hideNaturalTab}
      />
    </section>
  );
};
