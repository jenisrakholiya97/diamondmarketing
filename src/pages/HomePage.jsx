import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { QuoteForm } from '../components/QuoteForm';
import { ReviewSection } from '../components/ReviewSection';
import { ProductCardImage } from './ProductsPage';
import { Truck, ArrowRight, FileCheck, DollarSign, Video, Image as ImageIcon, Play, Pause, Eye, ExternalLink, ShieldCheck, FileText, X, Sparkles } from 'lucide-react';

const DiamondCardVideo = ({ videoUrl, posterUrl, isPlaying, onTogglePlay }) => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const videoElem = videoRef.current;
    if (!videoElem) return;

    try {
      videoElem.muted = true;
      if (isPlaying) {
        if (typeof videoElem.play === 'function') {
          const playPromise = videoElem.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => undefined);
          }
        }
      } else {
        if (typeof videoElem.pause === 'function') {
          videoElem.pause();
        }
      }
    } catch { /* ignore playback errors */ }
  }, [isPlaying, videoUrl]);

  return (
    <video
      ref={videoRef}
      src={videoUrl && String(videoUrl).trim().length > 0 ? videoUrl : undefined}
      poster={posterUrl && String(posterUrl).trim().length > 0 ? posterUrl : undefined}
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-contain filter brightness-105 cursor-pointer"
      onClick={onTogglePlay}
    >
      {videoUrl && String(videoUrl).trim().length > 0 && <source src={videoUrl} type="video/mp4" />}
    </video>
  );
};

export const HomePage = () => {
  const { navigate, openQuoteModal, SUPPLY_CAPABILITIES, diamonds = [] } = useShop();
  const [selectedModalDiamond, setSelectedModalDiamond] = useState(null);
  const [cardMediaModes, setCardMediaModes] = useState({});
  const [playingVideoIds, setPlayingVideoIds] = useState({});

  const featuredDiamonds = diamonds.slice(0, 4);

  // Lock body & document scroll and handle Escape key when Inspect 360 modal is open
  React.useEffect(() => {
    if (!selectedModalDiamond) return;

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedModalDiamond(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedModalDiamond]);

  const toggleVideo = (id) => {
    setPlayingVideoIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-16 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-100">
      {/* Hero Section: The 60-Second Answer */}
      <section className="bg-gradient-to-b from-[#0F172A] to-[#0B0F17] border border-slate-800 rounded-2xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded-full text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Direct Diamond Sourcing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans leading-tight">
            Loose diamonds for trade buyers who need speed and certainty.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            Source certified lab-grown loose diamonds with verified media, direct pricing, and a streamlined fulfillment workflow built for jewelers and studios.
          </p>

          {/* Key Facts Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 font-mono text-xs text-slate-300">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
              <span className="text-emerald-400 font-semibold block">Core Offering</span>
              <span>Lab-Grown • IGI Certified</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
              <span className="text-emerald-400 font-semibold block">Custom Studio</span>
              <span>Per order • GCAL 8X available</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
              <span className="text-emerald-400 font-semibold block">Delivery SLA</span>
              <span>7-day insured</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
              <span className="text-emerald-400 font-semibold block">Commercial Terms</span>
              <span>50/50 deposit</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={() => openQuoteModal()}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer"
            >
              <span>Request specifications</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/products?media=video')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Explore 360° Video Catalog</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured 360° HD Certified Diamond Video Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800 mb-2">
              <Video size={14} />
              <span>Daylight Calibrated 360° Video</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Live 360° Loose Diamond Inspection
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Inspect daylight-calibrated 360° rotation videos & macro studio scans for certified lab-grown diamonds directly from Surat cutting desks.
            </p>
          </div>

          <button
            onClick={() => navigate('/products?media=video')}
            data-testid="view-inventory-button"
            className="px-4 py-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <span>View Full {diamonds.length > 0 ? `${diamonds.length.toLocaleString()}+` : '0'} Inventory</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Featured Diamond Video Grid */}
        {featuredDiamonds.length === 0 ? (
          <div className="py-12 text-center bg-[#0B131F] border border-slate-800 rounded-2xl p-8 space-y-4">
            <Video className="mx-auto text-emerald-400 w-12 h-12" />
            <h3 className="text-lg font-bold text-white">No Products Currently in Catalog</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              Your product catalog is currently empty. Click below to add your first product or upload bulk diamond inventory.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Go to Products & Add Inventory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDiamonds.map((diamond) => {
              const mediaMode = cardMediaModes[diamond.id] || 'video';
              const isPlaying = playingVideoIds[diamond.id] ?? true;

            return (
              <div
                key={diamond.id}
                className="bg-[#0B131F] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition group shadow-xl"
              >
                {/* Media Container */}
                <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                  {mediaMode === 'photo' ? (
                    <ProductCardImage
                      diamond={diamond}
                      onClick={() => setSelectedModalDiamond(diamond)}
                    />
                  ) : (
                    <DiamondCardVideo
                      videoUrl={diamond.videoUrl}
                      posterUrl={diamond.imageUrl}
                      isPlaying={isPlaying}
                      onTogglePlay={() => toggleVideo(diamond.id)}
                    />
                  )}

                  {/* Media Mode Toggle Badges */}
                  <div className="absolute top-3 left-3 flex bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 backdrop-blur-md shadow-md text-[10px] font-mono z-10">
                    <button
                      onClick={() => {
                        setCardMediaModes((prev) => ({ ...prev, [diamond.id]: 'video' }));
                        setPlayingVideoIds((prev) => ({ ...prev, [diamond.id]: true }));
                      }}
                      className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${mediaMode === 'video' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Video size={10} />
                      <span>360° HD</span>
                    </button>
                    <button
                      onClick={() => setCardMediaModes((prev) => ({ ...prev, [diamond.id]: 'photo' }))}
                      className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${mediaMode === 'photo' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      <ImageIcon size={10} />
                      <span>Photo</span>
                    </button>
                  </div>

                  {/* Cert Badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-emerald-400 font-mono text-[10px] font-bold z-10">
                    {diamond.cert}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between mb-1">
                      <span>{diamond.shape}</span>
                      <span className="text-emerald-400 font-bold">{diamond.carat}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-emerald-400 transition">
                      {diamond.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Color / Clarity</span>
                      <span className="text-white font-semibold">{diamond.color} / {diamond.clarity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Wholesale Price</span>
                      <span className="text-emerald-400 font-extrabold">{diamond.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedModalDiamond(diamond)}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} />
                      <span>Inspect 360°</span>
                    </button>

                    <button
                      onClick={() =>
                        openQuoteModal({
                          category: diamond.category,
                          specs: `Request Quote for ${diamond.title} (${diamond.carat}, ${diamond.shape}, ${diamond.color}/${diamond.clarity}, Cert #: ${diamond.certNumber}, Price: ${diamond.price})`
                        })
                      }
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-md shadow-emerald-950"
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* Core Sourcing Model */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Sourcing Model
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            How procurement works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-emerald-400">
              <DollarSign size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Submit Spec List</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Share shape, carat, color, clarity, and quantity to get a precise sourcing brief.</p>
          </div>

          <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-emerald-400">
              <FileCheck size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Review & Quote</h3>
            <p className="text-slate-400 text-xs leading-relaxed">We match your requirements to available stock and return a USD quote with cert details.</p>
          </div>

          <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-emerald-400">
              <Truck size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Ship with Confidence</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Approve the media, complete the balance, and receive insured delivery to your destination.</p>
          </div>
        </div>
      </section>

      {/* Two Supply Categories Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              Core Offering
            </span>
            <span className="text-xs text-slate-400 font-mono">Physical samples available</span>
          </div>
          <h3 className="text-xl font-bold text-white">{SUPPLY_CAPABILITIES.labGrown.title}</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            {SUPPLY_CAPABILITIES.labGrown.summary} Standard IGI certification. GCAL 8X available on request for high-precision cut requirements.
          </p>
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Carat Range:</span>
              <span className="text-white font-semibold">0.30ct to 5.00ct+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Standard Cert:</span>
              <span className="text-emerald-400 font-semibold">IGI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color / Clarity:</span>
              <span className="text-white font-semibold">D–H / IF–SI1</span>
            </div>
          </div>
          <button
            onClick={() => openQuoteModal({ category: 'Lab-grown' })}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-900/50 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
          >
            Request Lab-Grown Specs
          </button>
        </div>

        <div className="bg-[#0B131F] border border-slate-800 rounded-xl p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
              Custom Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">Full certification & media</span>
          </div>
          <h3 className="text-xl font-bold text-white">{SUPPLY_CAPABILITIES.customStudio.title}</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            {SUPPLY_CAPABILITIES.customStudio.summary} Sourced directly from Surat polishing partners with full IGI & GCAL 8X certification scans and macro video.
          </p>
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Carat Range:</span>
              <span className="text-white font-semibold">0.30ct to 5.00ct+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Standard Cert:</span>
              <span className="text-emerald-400 font-semibold">IGI / GCAL 8X</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color / Clarity:</span>
              <span className="text-white font-semibold">D–H / IF–SI1</span>
            </div>
          </div>
          <button
            onClick={() => openQuoteModal({ category: 'Lab-grown' })}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
          >
            Request Custom Studio Specs
          </button>
        </div>
      </section>

      {/* Verified Trade Reviews Section */}
      <ReviewSection limit={3} title="Verified Trade Client Ratings & Reviews" />

      {/* Quote Form Section */}
      <section className="pt-4">
        <QuoteForm />
      </section>

      {/* Gem360 Modal for HomePage inspection */}
      {selectedModalDiamond && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 md:p-6 modal-backdrop-overlay animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedModalDiamond(null);
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-full max-w-3xl lg:max-w-4xl bg-[#0B131F] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] my-auto self-center flex flex-col text-slate-100"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/80">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Video size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug truncate">
                    {selectedModalDiamond.title}
                  </h3>
                  <div className="text-xs font-mono text-emerald-400 truncate">
                    ID: {selectedModalDiamond.id} • {selectedModalDiamond.shape} • {selectedModalDiamond.carat} • {selectedModalDiamond.color}/{selectedModalDiamond.clarity}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalDiamond(null)}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 aspect-square max-h-[260px] sm:max-h-[320px] mx-auto w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative shadow-xl">
                <DiamondCardVideo
                  videoUrl={selectedModalDiamond.videoUrl}
                  posterUrl={selectedModalDiamond.imageUrl}
                  isPlaying={true}
                />
              </div>

              <div className="lg:col-span-6 space-y-4 font-mono text-xs">
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px] font-sans">Certificate Details</span>
                    <span className="text-emerald-400 font-extrabold text-base">{selectedModalDiamond.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Cert Lab</span>
                      <span className="text-emerald-400 font-bold">{selectedModalDiamond.cert}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Report #</span>
                      <span className="text-white font-bold truncate block">{selectedModalDiamond.certNumber || selectedModalDiamond.id}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Cut Quality</span>
                      <span className="text-white font-bold">{selectedModalDiamond.cut || '3X EX'}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Polish / Sym</span>
                      <span className="text-white font-bold">{selectedModalDiamond.polish || 'EX'} / {selectedModalDiamond.symmetry || 'EX'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  {selectedModalDiamond.certUrl && (
                    <a
                      href={selectedModalDiamond.certUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Verify Report PDF</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      const diamond = selectedModalDiamond;
                      setSelectedModalDiamond(null);
                      openQuoteModal({
                        category: diamond.category,
                        specs: `Request Quote for ${diamond.title} (${diamond.carat}, ${diamond.shape}, ${diamond.color}/${diamond.clarity}, Cert #: ${diamond.certNumber}, Price: ${diamond.price})`
                      });
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider shadow-lg shadow-emerald-950 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Quote Stone</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


