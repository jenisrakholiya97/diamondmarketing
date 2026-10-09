import React, { useState } from 'react';
import { ProductCardImage } from '../pages/ProductsPage';
import { Sparkles, Video, Image as ImageIcon, Play, Pause, FileText, ArrowRight, Edit, Trash2 } from 'lucide-react';

const sampleDiamond = {
  id: 'custom-1791451187213-393',
  title: '1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond',
  shape: 'Round Brilliant',
  carat: '1.50 Ct',
  caratValue: 1.5,
  color: 'D',
  clarity: 'VVS1',
  cut: 'Ideal',
  cert: 'IGI Certified',
  certNumber: 'CERT-77440695',
  certUrl: 'https://www.igi.org',
  dimensions: '10.00 x 7.50 x 4.50 mm',
  table: '57.0%',
  depth: '62.0%',
  polish: 'Excellent',
  symmetry: 'Excellent',
  fluorescence: 'None',
  price: '$1,500.00',
  priceValue: 1500,
  isTripleExcellent: true,
  imageUrl: '/assets/valam/images/custom-1791451187213-393.jpg',
  images: ['/assets/valam/images/custom-1791451187213-393-0.jpg'],
  videoUrl: '/assets/valam/videos/custom-1791451187213-393.mp4',
  videoPoster: '/assets/nivaan/images/custom-1791451187213-393-poster.png',
  isCustomAdded: true,
};

export default {
  title: 'Products/ProductCard',
  parameters: {
    docs: {
      description: {
        component: 'Interactive certified diamond catalog card featuring Photo / 360° Video toggle, 3X Triple Excellent badge, specifications breakdown, and direct B2B quote action.',
      },
    },
  },
};

const DiamondCardDemo = ({ diamond, initialMode = 'photo' }) => {
  const [mediaMode, setMediaMode] = useState(initialMode);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="max-w-sm mx-auto bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col group">
      {/* Media Header & Toggles */}
      <div className="relative aspect-square bg-[#050811] flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {diamond.naturalOrLab || 'Lab-grown'}
          </span>
          {diamond.isTripleExcellent && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Sparkles size={9} /> 3X EX
            </span>
          )}
        </div>

        {/* Media Mode Buttons */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setMediaMode('photo')}
            title="Switch to Studio Photo"
            className={`p-1.5 rounded-md text-[10px] font-mono flex items-center gap-1 transition ${
              mediaMode === 'photo'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon size={12} />
            <span className="hidden sm:inline">Photo</span>
          </button>
          {diamond.videoUrl && (
            <button
              onClick={() => setMediaMode('video')}
              title="Switch to 360° Video"
              className={`p-1.5 rounded-md text-[10px] font-mono flex items-center gap-1 transition ${
                mediaMode === 'video'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video size={12} />
              <span className="hidden sm:inline">360° HD</span>
            </button>
          )}
        </div>

        {/* Media Container */}
        {mediaMode === 'photo' ? (
          <div className="w-full h-full p-4 flex items-center justify-center">
            <ProductCardImage diamond={diamond} />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              src={diamond.videoUrl}
              poster={diamond.videoPoster || diamond.imageUrl}
              loop
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-3 right-3 p-2 bg-slate-900/80 text-white rounded-full border border-slate-700 hover:bg-slate-800 transition"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>{diamond.shape}</span>
            <span className="text-emerald-400 font-semibold">{diamond.cert}</span>
          </div>
          <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
            {diamond.title}
          </h3>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Carat</span>
              <span className="font-bold text-slate-200">{diamond.carat}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Color</span>
              <span className="font-bold text-slate-200">{diamond.color}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Clarity</span>
              <span className="font-bold text-slate-200">{diamond.clarity}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Cut</span>
              <span className="font-bold text-slate-200">{diamond.cut}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Trade Price</span>
            <span className="text-lg font-bold text-emerald-400">{diamond.price}</span>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <span>Request Quote</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Admin Actions */}
        <div className="pt-2 border-t border-slate-800/40 flex items-center justify-end gap-2 text-xs">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition">
            <Edit size={12} /> Edit
          </button>
          <button className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded-lg flex items-center gap-1 transition">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const StudioPhotoMode = {
  render: () => <DiamondCardDemo diamond={sampleDiamond} initialMode="photo" />,
};

export const VideoLoop360Mode = {
  render: () => <DiamondCardDemo diamond={sampleDiamond} initialMode="video" />,
};

export const FancyOvalDiamondCard = {
  render: () => (
    <DiamondCardDemo
      diamond={{
        ...sampleDiamond,
        id: 'custom-1791451120390-868',
        shape: 'Oval',
        title: '1.50 Carat Oval Brilliant IGI Certified Lab-grown Diamond',
        videoUrl: '/assets/valam/videos/custom-1791451120390-868.mp4',
        imageUrl: '/assets/nivaan/images/custom-1791451120390-868.jpg',
      }}
      initialMode="photo"
    />
  ),
};
