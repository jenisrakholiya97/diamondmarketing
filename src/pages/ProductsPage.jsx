import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import fallbackDiamondsData from '../../server/data/fallback_diamonds.json';
import { DeleteProductModal } from '../components/DeleteProductModal';
import { EditProductModal } from '../components/EditProductModal';
import { isLocalhost } from '../utils/isLocalhost';
import {
  Video,
  Search,
  RotateCw,
  Play,
  Pause,
  X,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Eye,
  ArrowUpDown,
  Volume2,
  VolumeX,
  RefreshCw,
  Award,
  Zap,
  Image as ImageIcon,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  FileText,
  ChevronDown,
  Check,
  PlusCircle,
  Plus,
  Trash2,
  Edit,
  Package
} from 'lucide-react';

// SVG Diamond Shape Outline Icons
const DiamondShapeIcon = ({ shape, className = 'w-5 h-5' }) => {
  switch (shape) {
    case 'Round Brilliant':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="12,3 15,8 12,9 9,8" fill="currentColor" opacity="0.3" />
          <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    case 'Oval':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="7" ry="9" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    case 'Emerald':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6" stroke="currentColor" strokeWidth="1.5" />
          <rect x="7" y="6" width="10" height="12" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case 'Cushion':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="12,5 17,9 12,11 7,9" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'Radiant':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="6,3 18,3 21,6 21,18 18,21 6,21 3,18 3,6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6" y1="3" x2="18" y2="21" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="18" y1="3" x2="6" y2="21" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    case 'Pear':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 C12 2 5 10 5 15 C5 19 8 22 12 22 C16 22 19 19 19 15 C19 10 12 2 12 2 Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'Princess':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" />
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    case 'Marquise':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 C7 7, 5 12, 5 12 C5 12, 7 17, 12 22 C17 17, 19 12, 19 12 C19 12, 17 7, 12 2 Z" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    case 'Heart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'Asscher':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="7,3 17,3 21,7 21,17 17,21 7,21 3,17 3,7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="8" y="8" width="8" height="8" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case 'Hexagon':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="12,5 18,9 18,15 12,19 6,15 6,9" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    default:
      return <Sparkles className={className} />;
  }
};

// Interactive Video Player for Grid Cards with Direct DOM play/pause binding
const DiamondCardVideo = ({ videoUrl, posterUrl, isPlaying, onTogglePlay }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElem = videoRef.current;
    if (!videoElem) return;

    try {
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
    } catch { /* ignore playback issues */ }
  }, [isPlaying, videoUrl]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoUrl && String(videoUrl).trim().length > 0 ? videoUrl : undefined}
        poster={posterUrl && String(posterUrl).trim().length > 0 ? posterUrl : undefined}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-contain filter brightness-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover/video:scale-105 transition duration-500 cursor-pointer"
        onClick={onTogglePlay}
      />
    </div>
  );
};

// Product Card Image Component with Dedicated Loading & Error Placeholders
export const ProductCardImage = ({ diamond, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  const rawUrl = diamond?.imageUrl || (diamond?.images && diamond.images[0]) || '';
  const hasValidUrl = typeof rawUrl === 'string' && rawUrl.trim().length > 0;

  const checkImageComplete = (node) => {
    if (!node) return;
    if (node.complete) {
      if (node.naturalWidth > 0) {
        setImageLoaded(true);
      } else if (node.naturalWidth === 0 && node.src) {
        if (typeof node.decode === 'function') {
          node.decode()
            .then(() => setImageLoaded(true))
            .catch(() => undefined);
        }
      }
    }
  };

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);

    if (!hasValidUrl) {
      // If no valid URL yet, give brief hydration grace period then show clean fallback
      const timer = setTimeout(() => {
        setImageError(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (imgRef.current) {
      checkImageComplete(imgRef.current);
    }
  }, [rawUrl, diamond?.id, hasValidUrl]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 1. Loading state: shown while image is loading OR if image has not loaded yet / URL not yet available */}
      {!imageLoaded && !imageError && (
        <div
          data-testid={`image-loading-${diamond?.id}`}
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-[2px] transition-all duration-300 z-10 select-none"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <DiamondShapeIcon shape={diamond?.shape || 'Round Brilliant'} className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute" />
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2.5 font-medium tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Loading...
          </span>
        </div>
      )}

      {/* 2. Error / Failed / Not loaded properly state: NEVER show another image! Show clean fallback with status */}
      {imageError && (
        <div
          data-testid={`image-fallback-${diamond?.id}`}
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-slate-50/60 dark:bg-slate-950/60"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2.5">
            <DiamondShapeIcon shape={diamond?.shape || 'Round Brilliant'} className="w-7 h-7 text-emerald-600 dark:text-emerald-400 opacity-80" />
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {diamond?.carat || ''} {diamond?.shape || 'Diamond'}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
            <RotateCw size={10} className="animate-spin text-emerald-500" />
            <span>Loading media</span>
          </div>
        </div>
      )}

      {/* 3. Real Product Image: loads in background, reveals on onLoad */}
      {hasValidUrl && !imageError && (
        <img
          ref={(node) => {
            imgRef.current = node;
            if (node) checkImageComplete(node);
          }}
          src={rawUrl}
          alt={diamond?.title || 'Diamond'}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          data-testid={`product-image-${diamond?.id}`}
          onClick={onClick}
          className={`w-full h-full object-contain filter brightness-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover/photo:scale-105 transition-all duration-500 cursor-pointer ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
        />
      )}
    </div>
  );
};

// Table Product Thumbnail Component with Dedicated Loading & Error Placeholders
export const TableProductImage = ({ diamond, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  const rawUrl = diamond?.imageUrl || (diamond?.images && diamond.images[0]) || '';
  const hasValidUrl = typeof rawUrl === 'string' && rawUrl.trim().length > 0;

  const checkImageComplete = (node) => {
    if (!node) return;
    if (node.complete) {
      if (node.naturalWidth > 0) {
        setImageLoaded(true);
      } else if (node.naturalWidth === 0 && node.src) {
        if (typeof node.decode === 'function') {
          node.decode()
            .then(() => setImageLoaded(true))
            .catch(() => undefined);
        }
      }
    }
  };

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);

    if (!hasValidUrl) {
      const timer = setTimeout(() => {
        setImageError(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (imgRef.current) {
      checkImageComplete(imgRef.current);
    }
  }, [rawUrl, diamond?.id, hasValidUrl]);

  return (
    <div
      onClick={onClick}
      className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center cursor-pointer relative group"
    >
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div
          data-testid={`image-loading-table-${diamond?.id}`}
          className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-950 z-10"
        >
          <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {imageError && (
        <div
          data-testid={`image-fallback-table-${diamond?.id}`}
          className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400"
        >
          <DiamondShapeIcon shape={diamond?.shape || 'Round Brilliant'} className="w-5 h-5" />
        </div>
      )}

      {/* Real image */}
      {hasValidUrl && !imageError && (
        <img
          ref={(node) => {
            imgRef.current = node;
            if (node) checkImageComplete(node);
          }}
          src={rawUrl}
          alt={diamond?.title || 'Diamond'}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          data-testid={`table-image-${diamond?.id}`}
          className={`w-full h-full object-cover group-hover:scale-110 transition duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      )}

      <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
        <Eye size={12} className="text-slate-900 dark:text-white" />
      </div>
    </div>
  );
};

// Custom Category Dropdown Component
const CategoryCustomDropdown = ({ categories, selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedObj = categories.find((c) => c.value === selectedCategory) || categories[0];

  return (
    <div className={`relative w-full sm:w-auto shrink-0 ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 text-xs text-slate-800 dark:text-slate-200 font-mono font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-inner hover:bg-slate-100 dark:hover:bg-slate-900 transition"
      >
        <span>{selectedObj.label}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-[100] w-72 max-w-[90vw] max-h-72 overflow-y-auto bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-fade-in">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.value;
            return (
              <button
                key={c.value}
                onClick={() => {
                  setSelectedCategory(c.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
              >
                <span className="truncate">{c.label}</span>
                {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Custom Sort Dropdown Component
const SortCustomDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'recommended', label: 'Sort: Recommended' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'carat-high', label: 'Carat: High to Low' },
    { value: 'carat-low', label: 'Carat: Low to High' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedObj = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];

  return (
    <div className={`relative w-full sm:w-52 ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-emerald-500 cursor-pointer shadow-inner hover:bg-slate-100 dark:hover:bg-slate-900 transition"
      >
        <span className="truncate">{selectedObj.label}</span>
        <ArrowUpDown size={14} className={`text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 z-[100] w-full min-w-[200px] max-h-72 overflow-y-auto bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-fade-in">
          {sortOptions.map((o) => {
            const isSelected = sortBy === o.value;
            return (
              <button
                key={o.value}
                onClick={() => {
                  setSortBy(o.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
              >
                <span>{o.label}</span>
                {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ProductsPage = () => {
  const { openQuoteModal, customDiamonds = [], diamonds = [], openAddProductModal, deleteDiamond, updateDiamond } = useShop();

  const safeSrc = (val) => (val && String(val).trim().length > 0 ? val : undefined);
  const [deleteConfirmDiamond, setDeleteConfirmDiamond] = useState(null);
  const [editingDiamond, setEditingDiamond] = useState(null);

  const handleDeleteProduct = (e, id) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    const target = diamonds.find((d) => String(d.id) === String(id)) || customDiamonds.find((c) => String(c.id) === String(id)) || { id };
    setDeleteConfirmDiamond(target);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDiamond) return;
    const targetId = deleteConfirmDiamond.id;
    if (selectedModalDiamond && String(selectedModalDiamond.id) === String(targetId)) {
      setSelectedModalDiamond(null);
    }
    setDeleteConfirmDiamond(null);
    await deleteDiamond(targetId);
  };

  const handleEditProduct = (e, item) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setEditingDiamond(item);
  };

  const handleSaveEditedProduct = async (updatedDiamond) => {
    if (!updatedDiamond) return;
    await updateDiamond(updatedDiamond);
    if (selectedModalDiamond && String(selectedModalDiamond.id) === String(updatedDiamond.id)) {
      setSelectedModalDiamond((prev) => ({ ...prev, ...updatedDiamond }));
    }
    setEditingDiamond(null);
  };

  // View Mode: 'grid' | 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Product Source Filter: 'all' | 'added' | 'stock'
  const [productSourceFilter, setProductSourceFilter] = useState('all');

  // Filters State
  const [selectedType, setSelectedType] = useState('Lab-grown'); // Strictly Lab-Grown Only
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedShape, setSelectedShape] = useState('All');
  const [selectedCaratRange, setSelectedCaratRange] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedClarity, setSelectedClarity] = useState('All');
  const [onlyTripleExcellent, setOnlyTripleExcellent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(24);

  // Multi-select batch quotes state
  const [selectedDiamondIds, setSelectedDiamondIds] = useState([]);

  // Playing videos & media errors on grid cards
  const [playingVideoIds, setPlayingVideoIds] = useState({});
  const [cardMediaModes, setCardMediaModes] = useState({});
  const [globalMediaMode, setGlobalMediaMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('media=video')) {
      return 'video';
    }
    return 'photo'; // Default to Photo mode!
  });

  // Listen for navigation changes to update media mode if ?media=video parameter changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('media=video')) {
        setGlobalMediaMode('video');
      }
    }
  }, []);

  // Modal State for Gem360 HD Video & Multi-Angle Photo Viewer
  const [selectedModalDiamond, setSelectedModalDiamond] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalActiveTab, setModalActiveTab] = useState('gem360'); // 'gem360' | 'report'
  const [modalMediaMode, setModalMediaMode] = useState('video'); // 'video' | 'photo'
  const [modalIsPlaying, setModalIsPlaying] = useState(true);
  const [modalIsMuted, setModalIsMuted] = useState(true);
  const [modalPlaybackSpeed, setModalPlaybackSpeed] = useState(1);
  const [modalImageError, setModalImageError] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);

  // Drag 360 rotation simulation
  const [dragRotationAngle, setDragRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const modalVideoRef = useRef(null);

  const shapes = [
    { name: 'All', shapeName: 'All' },
    { name: 'Round Brilliant', shapeName: 'Round Brilliant' },
    { name: 'Oval', shapeName: 'Oval' },
    { name: 'Emerald', shapeName: 'Emerald' },
    { name: 'Cushion', shapeName: 'Cushion' },
    { name: 'Radiant', shapeName: 'Radiant' },
    { name: 'Pear', shapeName: 'Pear' },
    { name: 'Princess', shapeName: 'Princess' },
    { name: 'Marquise', shapeName: 'Marquise' },
    { name: 'Heart', shapeName: 'Heart' },
    { name: 'Asscher', shapeName: 'Asscher' },
    { name: 'Hexagon', shapeName: 'Hexagon' }
  ];

  const categories = [
    { label: 'All Catalog Diamonds', value: 'All' },
    { label: '💎 Loose Certified Diamonds', value: 'diamond' },
    { label: 'Solitaire Diamond Rings', value: 'solitaire' },
    { label: 'Eternity Diamond Bands', value: 'Anniversary' },
    { label: 'Vintage Filigree Diamond Rings', value: 'Vintage' },
    { label: 'Side Stone Diamond Rings', value: 'Side Stone' },
    { label: 'Diamond Studs & Earrings', value: 'Studs' },
    { label: 'Diamond Hoop Earrings', value: 'Hoops' },
    { label: 'Fashion Diamond Collections', value: 'Fashion' },
    { label: 'Diamond Tennis Bracelets', value: 'Tennis' },
    { label: 'Halo Diamond Rings', value: 'Halo' }
  ];

  const colors = ['All', 'D', 'E', 'F', 'G'];
  const clarities = ['All', 'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2'];
  const caratRanges = [
    { label: 'All Carats', value: 'All' },
    { label: '1.0 - 1.99 Ct', value: '1.0-1.9' },
    { label: '2.0 - 2.99 Ct', value: '2.0-2.9' },
    { label: '3.0+ Ct', value: '3.0+' }
  ];

  // Grid Video toggle
  const toggleGridVideo = (id) => {
    setPlayingVideoIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleSelectDiamond = (id) => {
    setSelectedDiamondIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredDiamonds.map((d) => d.id);
    const allSelected = filteredIds.every((id) => selectedDiamondIds.includes(id));
    if (allSelected) {
      setSelectedDiamondIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedDiamondIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Select data source: in products tab show strictly only server/data/fallback_diamonds.json data
  const sourceDiamonds = React.useMemo(() => {
    const isTestMode =
      (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
      (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test');

    const fallbackList = Array.isArray(fallbackDiamondsData) ? fallbackDiamondsData : [];
    const fallbackIds = new Set(fallbackList.map((d) => String(d.id || d.originalId)));

    let base;
    if (!isTestMode) {
      // In live website/browser: strictly and exclusively show diamonds present in server/data/fallback_diamonds.json
      // plus any diamond added during this active session
      const sessionAdded = (diamonds || []).filter((d) => d._isSessionAdded && !d.isFake);
      const sessionAddedIds = new Set(sessionAdded.map((d) => String(d.id)));
      const mergedFallback = fallbackList
        .filter((item) => !sessionAddedIds.has(String(item.id)))
        .map((item) => {
          const liveMatch = (diamonds || []).find(
            (d) => String(d.id) === String(item.id) || String(d.originalId) === String(item.id)
          );
          return liveMatch ? { ...item, ...liveMatch } : item;
        });
      base = [...sessionAdded, ...mergedFallback];
    } else {
      // In test mode: allow test fixtures (e.g. del-grid-test-101, edit-grid-test-101, test-1) and session added items
      if (!diamonds || diamonds.length === 0) {
        return [];
      }
      base = diamonds.filter((d) => {
        if (d.isFake) return false;
        const idStr = String(d.id || '');
        if (idStr.startsWith('custom-') && !fallbackIds.has(idStr) && !d._isSessionAdded && !idStr.includes('test')) {
          return false;
        }
        return true;
      });
    }

    if (productSourceFilter === 'added') {
      return base.filter((d) => d.isCustomAdded);
    }
    return base;
  }, [diamonds, productSourceFilter]);

  // Comprehensive Catalog Filter Logic
  const filteredDiamonds = sourceDiamonds.filter((d) => {
    const matchesType = (d.naturalOrLab || 'Lab-grown').toLowerCase() === 'lab-grown';
    const matchesCategory =
      selectedCategory === 'All' ||
      (d.category && d.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (d.productType && d.productType.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesShape =
      selectedShape === 'All' ||
      (d.shape && d.shape.toLowerCase() === selectedShape.toLowerCase()) ||
      (selectedShape.toLowerCase() === 'round' && d.shape && d.shape.toLowerCase().includes('round'));


    const matchesColor = selectedColor === 'All' || d.color === selectedColor;
    const matchesClarity = selectedClarity === 'All' || d.clarity === selectedClarity;
    const matches3X = !onlyTripleExcellent || d.isTripleExcellent;

    let matchesCarat = true;
    if (selectedCaratRange === '1.0-1.9') {
      matchesCarat = d.caratValue >= 1.0 && d.caratValue <= 1.99;
    } else if (selectedCaratRange === '2.0-2.9') {
      matchesCarat = d.caratValue >= 2.0 && d.caratValue <= 2.99;
    } else if (selectedCaratRange === '3.0+') {
      matchesCarat = d.caratValue >= 3.0;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (d.title && d.title.toLowerCase().includes(searchLower)) ||
      (d.carat != null && String(d.carat).toLowerCase().includes(searchLower)) ||
      (d.certNumber && d.certNumber.toLowerCase().includes(searchLower)) ||
      (d.shape && d.shape.toLowerCase().includes(searchLower)) ||
      (d.color && d.color.toLowerCase().includes(searchLower)) ||
      (d.clarity && d.clarity.toLowerCase().includes(searchLower)) ||
      (d.category && d.category.toLowerCase().includes(searchLower));

    return (
      matchesType &&
      matchesCategory &&
      matchesShape &&
      matchesColor &&
      matchesClarity &&
      matches3X &&
      matchesCarat &&
      matchesSearch
    );
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceValue - b.priceValue;
    if (sortBy === 'price-high') return b.priceValue - a.priceValue;
    if (sortBy === 'carat-high') return b.caratValue - a.caratValue;
    if (sortBy === 'carat-low') return a.caratValue - b.caratValue;
    return 0;
  });

  const paginatedDiamonds = filteredDiamonds.slice(0, visibleCount);

  const resetFilters = () => {
    setSelectedType('Lab-grown');
    setSelectedCategory('All');
    setSelectedShape('All');
    setSelectedCaratRange('All');
    setSelectedColor('All');
    setSelectedClarity('All');
    setOnlyTripleExcellent(false);
    setSearchTerm('');
    setSortBy('recommended');
    setProductSourceFilter('all');
    setVisibleCount(24);
  };

  const hasActiveFilters =
    selectedType !== 'Lab-grown' ||
    selectedCategory !== 'All' ||
    selectedShape !== 'All' ||
    selectedCaratRange !== 'All' ||
    selectedColor !== 'All' ||
    selectedClarity !== 'All' ||
    onlyTripleExcellent ||
    searchTerm.trim() !== '' ||
    sortBy !== 'recommended' ||
    productSourceFilter !== 'all';

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedModalDiamond) {
        setSelectedModalDiamond(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModalDiamond]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (selectedModalDiamond || deleteConfirmDiamond) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedModalDiamond, deleteConfirmDiamond]);


  // Modal Video playback & speed control
  useEffect(() => {
    const videoElem = modalVideoRef.current;
    if (!videoElem || modalMediaMode !== 'video' || modalActiveTab !== 'gem360') return;

    try {
      videoElem.playbackRate = modalPlaybackSpeed;

      if (modalIsPlaying) {
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
    } catch { /* ignore modal video playback issues */ }
  }, [modalIsPlaying, modalPlaybackSpeed, selectedModalDiamond, modalActiveTab, modalMediaMode]);

  // Handle Drag 360 Rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    dragStartX.current = e.clientX;
    setDragRotationAngle((prev) => (prev + deltaX * 1.5) % 360);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const openDiamondModal = (diamond, initialTab = 'gem360') => {
    setSelectedModalDiamond(diamond);
    setSelectedImageIndex(0);
    setModalActiveTab(initialTab);
    setModalMediaMode(diamond.videoUrl ? 'video' : 'photo');
    setModalIsPlaying(true);
    setModalIsMuted(true);
    setModalPlaybackSpeed(1);
    setModalImageError(false);
    setModalImageLoaded(false);
    setDragRotationAngle(0);
  };

  const triggerBatchQuote = () => {
    const selectedDiamonds = diamonds.filter((d) => selectedDiamondIds.includes(d.id));
    if (selectedDiamonds.length === 0) return;

    const specsSummary = `Requesting USD Quote for ${selectedDiamonds.length} Selected Items from Nivaan Design Catalog:\n\n` +
      selectedDiamonds.map((d, index) => `${index + 1}. ${d.title}\nID: ${d.id}\nCarat: ${d.carat}\nShape: ${d.shape}\nColor: ${d.color}\nClarity: ${d.clarity}\nCert #: ${d.certNumber}\nPrice: ${d.price}`).join('\n\n');

    openQuoteModal({
      category: 'Batch Selected Diamonds',
      specs: specsSummary
    });
  };

  return (
    <div className="space-y-10 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900 dark:text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-white to-slate-100 dark:from-slate-950 dark:via-[#0A111D] dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/90 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800/80 flex items-center gap-2 shadow-sm">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>Nivaan Design Loose Diamond Collection</span>
              </span>
              <span className="text-xs font-mono text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 px-3 py-1.5 rounded-full border border-cyan-300 dark:border-cyan-800/80 flex items-center gap-1.5">
                <Zap size={13} />
                <span>100% Authentic HD Diamonds</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Certified Loose Lab-Grown Diamonds
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore 100% authentic loose certified diamonds across all 10 shapes (Round, Oval, Emerald, Cushion, Radiant, Pear, Princess, Marquise, Heart, Asscher) with HD 360° rotation videos and IGI & GCAL 8X reports.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
            {isLocalhost() && (
              <button
                onClick={() => openAddProductModal('single')}
                className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-mono font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/30 border border-emerald-400/30 shrink-0 transform hover:-translate-y-0.5"
              >
                <PlusCircle size={16} />
                <span>Add Product</span>
              </button>
            )}

            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className={`px-4 py-3.5 rounded-2xl text-xs font-mono flex items-center justify-center gap-2 transition shrink-0 ${hasActiveFilters
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-md'
                : 'bg-slate-100/60 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-900 cursor-not-allowed opacity-60'
                }`}
            >
              <RefreshCw size={14} className={hasActiveFilters ? 'text-emerald-600 dark:text-emerald-400' : ''} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch USD Quote Floating Bar */}
      {selectedDiamondIds.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-white dark:from-emerald-950/80 dark:via-[#0B131F] dark:to-slate-950 border border-emerald-300 dark:border-emerald-800/80 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl dark:shadow-2xl transition-colors backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-md shadow-emerald-600/30">
              {selectedDiamondIds.length}
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {selectedDiamondIds.length} {selectedDiamondIds.length === 1 ? 'Item' : 'Items'} Selected for Batch Quotation
              </div>
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-mono font-medium">
                Click below to send a combined USD quote request to our official desk.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={triggerBatchQuote}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Request Batch USD Quote</span>
            </button>

            <button
              onClick={() => setSelectedDiamondIds([])}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono transition cursor-pointer font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter & View Toolbar Box */}
      <div className="relative z-30 bg-white/90 dark:bg-[#0B131F]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-6 space-y-4 sm:space-y-6 shadow-lg dark:shadow-2xl transition-colors max-w-full overflow-hidden sm:overflow-visible">
        {/* Category & Natural/Lab Selectors, Search & Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
          {/* Category & Type Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* 100% Lab-Grown Badge */}
            <div className="flex w-full sm:w-auto justify-center sm:justify-start bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-2 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 items-center gap-1.5 shadow-sm">
              <Sparkles size={14} className="text-emerald-500 animate-pulse" />
              <span>100% Lab-Grown Diamonds</span>
            </div>

            {/* Product Source Tabs: All Uploaded Products vs Added Products Only */}
            <div className="flex w-full sm:w-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setProductSourceFilter('all')}
                className={`flex-1 sm:flex-initial justify-center px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${productSourceFilter === 'all'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <span className="sm:hidden">All Uploaded ({diamonds.length})</span>
                <span className="hidden sm:inline">All Uploaded Products ({diamonds.length})</span>
              </button>
              <button
                onClick={() => setProductSourceFilter('added')}
                className={`flex-1 sm:flex-initial justify-center px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${productSourceFilter === 'added'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Sparkles size={13} className="text-amber-400 shrink-0" />
                <span className="sm:hidden">Added Only ({customDiamonds.length})</span>
                <span className="hidden sm:inline">Added Products Only ({customDiamonds.length})</span>
              </button>
            </div>

            {/* + Add Product Button in Toolbar */}
            {isLocalhost() && (
              <button
                onClick={() => openAddProductModal('single')}
                className="w-full sm:w-auto justify-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            )}

            {/* Custom Category Selector Dropdown */}
            <CategoryCustomDropdown
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* 3X Triple Excellent Toggle */}
            <button
              onClick={() => setOnlyTripleExcellent(!onlyTripleExcellent)}
              className={`w-full sm:w-auto justify-center px-3.5 py-2 rounded-2xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 border ${onlyTripleExcellent
                ? 'bg-amber-500/10 border-amber-400 text-amber-700 dark:text-amber-300 font-bold shadow-md'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Award size={14} className={onlyTripleExcellent ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'} />
              <span>3X EX Only</span>
            </button>

            {/* Global Catalog Media View Switcher */}
            <div className="flex w-full sm:w-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setGlobalMediaMode('video');
                  setCardMediaModes({});
                }}
                className={`flex-1 sm:flex-initial justify-center p-2 px-3 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${globalMediaMode === 'video'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Default all cards to 360° Video loop"
              >
                <Video size={14} />
                <span>360° Video</span>
              </button>
              <button
                onClick={() => {
                  setGlobalMediaMode('photo');
                  setCardMediaModes({});
                }}
                className={`flex-1 sm:flex-initial justify-center p-2 px-3 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${globalMediaMode === 'photo'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Default all cards to Photo Scan mode"
              >
                <ImageIcon size={14} />
                <span>Photo Scans</span>
              </button>
            </div>
          </div>

          {/* View Mode Switcher, Search Input & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Grid vs Table View Mode Switcher */}
            <div className="flex w-full sm:w-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-initial justify-center p-2 px-3 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'grid'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Grid Cards View"
              >
                <LayoutGrid size={15} />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-initial justify-center p-2 px-3 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${viewMode === 'table'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="B2B Table List View"
              >
                <List size={15} />
                <span>Table</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, carat, shape, cert #..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <SortCustomDropdown
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>

        {/* Vector SVG Diamond Cut Filter Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Select Diamond Shape / Cut:</span>
            </span>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              {selectedShape === 'All' ? 'All Diamond Shapes' : selectedShape}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {shapes.map((sh) => {
              const isSelected = selectedShape === sh.shapeName;
              return (
                <button
                  key={sh.shapeName}
                  onClick={() => setSelectedShape(sh.shapeName)}
                  className={`p-2.5 rounded-2xl text-xs font-mono transition cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${isSelected
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                >
                  <DiamondShapeIcon
                    shape={sh.shapeName}
                    className={`w-6 h-6 transition-transform ${isSelected ? 'scale-110 text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
                  />
                  <span className="text-[10px] tracking-tight truncate w-full">
                    {sh.name === 'Round Brilliant' ? 'Round' : sh.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Extra Specs Filter Row (Carat, Color, Clarity) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          {/* Carat Range */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Carat Range:</span>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {caratRanges.map((cr) => (
                <button
                  key={cr.value}
                  onClick={() => setSelectedCaratRange(cr.value)}
                  className={`flex-1 py-1.5 px-1.5 rounded-xl text-[11px] font-mono transition cursor-pointer text-center ${selectedCaratRange === cr.value
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  {cr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Grade */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Color Grade:</span>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {colors.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-mono transition cursor-pointer text-center ${selectedColor === col
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Clarity Grade */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Clarity Grade:</span>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              {clarities.map((cla) => (
                <button
                  key={cla}
                  onClick={() => setSelectedClarity(cla)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-mono transition cursor-pointer text-center whitespace-nowrap ${selectedClarity === cla
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  {cla}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Display */}
      {filteredDiamonds.length === 0 ? (
        productSourceFilter === 'added' && customDiamonds.length === 0 ? (
          <div className="bg-white/80 dark:bg-[#0B131F]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Custom Products Added Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              You are currently viewing the "Added Products Only" catalog filter. Click the button below to upload single or bulk diamonds.
            </p>
            {isLocalhost() && (
              <button
                onClick={() => openAddProductModal('single')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                <PlusCircle size={16} />
                <span>Add Custom Diamond Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-[#0B131F]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center mx-auto">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Products Match Your Criteria</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              Try adjusting your search terms, shape, category, or carat filters to view more items from our catalog.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              <RefreshCw size={14} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )
      ) : viewMode === 'table' ? (
        /* B2B Table List View */
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/90 dark:bg-slate-950/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 text-center">
                    <button
                      onClick={toggleSelectAllFiltered}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      title="Select All Filtered"
                    >
                      <CheckSquare size={16} />
                    </button>
                  </th>
                  <th className="p-4">Media</th>
                  <th className="p-4">Title & Item ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Shape</th>
                  <th className="p-4">Carat</th>
                  <th className="p-4">Color / Clarity</th>
                  <th className="p-4">Cut</th>
                  <th className="p-4">Cert / Report</th>
                  <th className="p-4">Price (USD)</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedDiamonds.map((diamond) => {
                  const isSelected = selectedDiamondIds.includes(diamond.id);

                  return (
                    <tr
                      key={diamond.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-900/60 transition ${isSelected ? 'bg-emerald-50/60 dark:bg-emerald-950/30' : ''
                        }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleSelectDiamond(diamond.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                          title="Select Item"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <TableProductImage
                          diamond={diamond}
                          onClick={() => openDiamondModal(diamond, 'gem360')}
                        />
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {diamond.title}
                        <div className="text-[10px] text-slate-500 font-normal">{diamond.id}</div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">{diamond.category}</td>
                      <td className="p-4 font-bold text-slate-700 dark:text-slate-200">{diamond.shape}</td>
                      <td className="p-4 font-extrabold text-emerald-700 dark:text-emerald-400">{diamond.carat}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {diamond.color} / {diamond.clarity}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">{diamond.cut}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{diamond.cert}</span>
                        <div className="text-[10px]">{diamond.certNumber}</div>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white text-sm">{diamond.price}</td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openDiamondModal(diamond, 'report')}
                              className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm"
                              title="View Lab Report PDF"
                            >
                              <FileText size={14} />
                            </button>
                            <button
                              onClick={() =>
                                openQuoteModal({
                                  category: diamond.category,
                                  specs: `Requesting USD Quote:\n${diamond.title}\nID: ${diamond.id}\nCarat: ${diamond.carat}\nShape: ${diamond.shape}\nColor: ${diamond.color}\nClarity: ${diamond.clarity}\nCert #: ${diamond.certNumber}\nPrice: ${diamond.price}`
                                })
                              }
                              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-all duration-200 cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center hover:scale-105 active:scale-95"
                            >
                              Quote
                            </button>
                          </div>

                          {isLocalhost() && (
                            <div className="flex items-center justify-end gap-1.5 pt-0.5">
                              <button
                                onClick={(e) => handleEditProduct(e, diamond)}
                                className="h-7 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/70 dark:hover:bg-amber-900/90 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 hover:scale-105 active:scale-95 shadow-sm text-[11px] font-mono font-bold"
                                title="Edit Product Details"
                                data-testid={`edit-table-${diamond.id}`}
                              >
                                <Edit size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={(e) => handleDeleteProduct(e, diamond.id)}
                                className="h-7 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:hover:bg-rose-900/90 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 hover:scale-105 active:scale-95 shadow-sm text-[11px] font-mono font-bold"
                                title="Delete Product from Database"
                                data-testid={`delete-table-${diamond.id}`}
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedDiamonds.map((diamond) => {
            const cardMode = cardMediaModes[diamond.id] || globalMediaMode;
            const isPlaying = playingVideoIds[diamond.id] ?? true;
            const isPhotoMode = !diamond.videoUrl || cardMode === 'photo';
            const isSelected = selectedDiamondIds.includes(diamond.id);

            return (
              <div
                key={diamond.id}
                className={`bg-white dark:bg-[#0B131F] border rounded-3xl overflow-hidden shadow-md dark:shadow-xl hover:shadow-xl dark:hover:shadow-emerald-950/40 transition duration-300 flex flex-col justify-between group ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/60'
                  }`}
              >
                {/* Product Media Container */}
                <div
                  onMouseEnter={() => {
                    if (diamond.videoUrl && cardMode === 'video') {
                      setPlayingVideoIds((prev) => ({ ...prev, [diamond.id]: true }));
                    }
                  }}
                  onMouseLeave={() => {
                    if (diamond.videoUrl && cardMode === 'video') {
                      setPlayingVideoIds((prev) => ({ ...prev, [diamond.id]: false }));
                    }
                  }}
                  className="relative h-64 bg-gradient-to-b from-slate-100 via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-black overflow-hidden flex items-center justify-center p-4 group/video border-b border-slate-200 dark:border-slate-800"
                >
                  {isPhotoMode ? (
                    <div className="relative w-full h-full flex items-center justify-center group/photo">
                      <ProductCardImage
                        diamond={diamond}
                        onClick={() => openDiamondModal(diamond, 'gem360')}
                      />

                      {/* Hover / Click Play Video Indicator Overlay on Photo */}
                      {diamond.videoUrl && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardMediaModes((prev) => ({ ...prev, [diamond.id]: 'video' }));
                            setPlayingVideoIds((prev) => ({ ...prev, [diamond.id]: true }));
                          }}
                          className="absolute inset-0 bg-slate-900/10 dark:bg-black/20 opacity-0 group-hover/photo:opacity-100 transition flex items-center justify-center cursor-pointer z-10"
                        >
                          <div className="w-14 h-14 rounded-full bg-emerald-600/90 dark:bg-emerald-500/90 text-white flex items-center justify-center shadow-2xl transform group-hover/photo:scale-110 transition ring-4 ring-emerald-400/30">
                            <Play size={24} className="ml-0.5 fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <DiamondCardVideo
                      videoUrl={diamond.videoUrl}
                      posterUrl={diamond.imageUrl || diamond.videoPoster}
                      isPlaying={isPlaying}
                      onTogglePlay={() => toggleGridVideo(diamond.id)}
                    />
                  )}

                  {/* Play Overlay Button for Video when paused */}
                  {!isPhotoMode && !isPlaying && (
                    <div
                      onClick={() => toggleGridVideo(diamond.id)}
                      className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 group-hover/video:bg-slate-900/10 transition flex items-center justify-center cursor-pointer z-10"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-600 dark:bg-emerald-500/90 text-white flex items-center justify-center shadow-2xl transform group-hover/video:scale-110 transition ring-4 ring-emerald-400/30">
                        <Play size={24} className="ml-0.5 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Pause Button Badge when video is playing */}
                  {!isPhotoMode && isPlaying && (
                    <button
                      onClick={() => toggleGridVideo(diamond.id)}
                      className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white px-2.5 py-1 rounded-xl backdrop-blur-md transition cursor-pointer z-10 shadow-md border border-slate-700 flex items-center gap-1.5 text-[11px] font-mono font-bold"
                      title="Pause 360° Video"
                    >
                      <Pause size={13} className="fill-white text-white" />
                      <span>Pause</span>
                    </button>
                  )}

                  {/* Checkbox Select & Media Mode Pills Overlay (Top Left) */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectDiamond(diamond.id);
                      }}
                      className="p-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white backdrop-blur-md transition cursor-pointer shadow-md"
                      title={isSelected ? 'Deselect Item' : 'Select for Batch Quote'}
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Square size={16} className="text-slate-400" />
                      )}
                    </button>

                    {diamond.videoUrl && (
                      <div className="flex bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 backdrop-blur-md shadow-md text-[10px] font-mono">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardMediaModes((prev) => ({ ...prev, [diamond.id]: 'video' }));
                            setPlayingVideoIds((prev) => ({ ...prev, [diamond.id]: true }));
                          }}
                          className={`px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${!isPhotoMode ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                          title="Switch to 360° Video"
                        >
                          <Video size={10} />
                          <span>360° HD</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardMediaModes((prev) => ({ ...prev, [diamond.id]: 'photo' }));
                            setPlayingVideoIds((prev) => ({ ...prev, [diamond.id]: false }));
                          }}
                          className={`px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${isPhotoMode ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                          title="Switch to Studio Photo"
                        >
                          <ImageIcon size={10} />
                          <span>Photo</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Natural / Lab Tag (Top Right) */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
                    <span className="px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold backdrop-blur-md shadow-md">
                      {diamond.naturalOrLab}
                    </span>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>{diamond.category}</span>
                      <span>{diamond.shape}</span>
                    </div>

                    <h3
                      onClick={() => openDiamondModal(diamond, 'gem360')}
                      className="font-extrabold text-slate-900 dark:text-white text-base leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer line-clamp-2"
                      title={diamond.title}
                    >
                      {diamond.title}
                    </h3>
                  </div>

                  {/* Specs Breakdown Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Carat / Cut</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{diamond.carat}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-[10px] block truncate">{diamond.cut}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Color / Clarity</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{diamond.color} / {diamond.clarity}</span>
                      <span className="text-slate-500 text-[10px] block truncate">{diamond.cert}</span>
                    </div>
                  </div>

                  {/* Footer Price & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase font-medium">Wholesale Price</span>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">{diamond.price}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openDiamondModal(diamond, 'gem360')}
                          data-testid="open-media-gallery-button"
                          className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm"
                          title="View Media Gallery"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() =>
                            openQuoteModal({
                              category: diamond.category,
                              specs: `Requesting USD Quote:\n${diamond.title}\nID: ${diamond.id}\nCarat: ${diamond.carat}\nShape: ${diamond.shape}\nColor: ${diamond.color}\nClarity: ${diamond.clarity}\nCert #: ${diamond.certNumber}\nPrice: ${diamond.price}`
                            })
                          }
                          className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          Quote
                        </button>
                      </div>
                    </div>

                    {/* Bottom Admin/Localhost Management Button Set */}
                    {isLocalhost() && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          onClick={(e) => handleEditProduct(e, diamond)}
                          className="flex-1 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60 text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
                          title="Edit Product Details"
                          data-testid={`edit-card-${diamond.id}`}
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteProduct(e, diamond.id)}
                          className="flex-1 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
                          title="Delete Product from Database"
                          data-testid={`delete-card-${diamond.id}`}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Load More Button */}
      {filteredDiamonds.length > visibleCount && (
        <div className="pt-6 text-center space-y-3">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing {paginatedDiamonds.length} of {filteredDiamonds.length} items
          </div>
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-2xl border border-slate-700 transition cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            <span>Load More Products</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Gem360 HD Video & Multi-Angle Photo Viewer Modal */}
      {selectedModalDiamond && (
        <div
          className="fixed inset-0 z-[9995] flex items-center justify-center p-2.5 sm:p-4 md:p-6 modal-backdrop-overlay animate-fadeIn"
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
            className="relative w-full max-w-4xl lg:max-w-5xl bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] my-auto self-center flex flex-col text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/80">
              <div className="flex items-center justify-between w-full sm:w-auto gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    {modalActiveTab === 'gem360' ? <Video size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">
                      {selectedModalDiamond.title}
                    </h3>
                    <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 truncate">
                      ID: {selectedModalDiamond.id} • {selectedModalDiamond.shape} • {selectedModalDiamond.carat}
                    </div>
                  </div>
                </div>

                {/* Mobile Close Button */}
                <button
                  onClick={() => setSelectedModalDiamond(null)}
                  className="sm:hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Tabs Switcher & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setModalActiveTab('gem360')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${modalActiveTab === 'gem360'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <Video size={13} />
                    <span>Media Gallery</span>
                  </button>
                  <button
                    onClick={() => setModalActiveTab('report')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${modalActiveTab === 'report'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <FileText size={13} />
                    <span>Lab Grading</span>
                  </button>
                </div>

                {isLocalhost() && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleEditProduct(e, selectedModalDiamond)}
                      className="px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="Edit Product Details"
                      data-testid="edit-modal-product-button"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteProduct(e, selectedModalDiamond.id)}
                      className="px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="Delete Product from Database"
                      data-testid="delete-modal-product-button"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {/* Desktop Close Button */}
                <button
                  onClick={() => setSelectedModalDiamond(null)}
                  className="hidden sm:flex w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white items-center justify-center transition cursor-pointer border border-slate-200 dark:border-slate-800 shrink-0"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column: Media Player / Multi-Angle Gallery */}
              <div className="lg:col-span-6 space-y-4">
                {modalActiveTab === 'report' ? (
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            Official Lab Grading Report
                          </div>
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            {selectedModalDiamond.cert} #{selectedModalDiamond.certNumber}
                          </div>
                        </div>
                      </div>

                      {selectedModalDiamond.certUrl && (
                        <a
                          href={selectedModalDiamond.certUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition shadow-md w-full sm:w-auto"
                        >
                          <span>Verify Report PDF</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="font-bold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Proportions & Certificate Specifications</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-slate-700 dark:text-slate-300 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Table Percentage</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedModalDiamond.table || '57.0%'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Total Depth</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedModalDiamond.depth || '61.4%'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Polish</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedModalDiamond.polish || 'Excellent'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Symmetry</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedModalDiamond.symmetry || 'Excellent'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="relative aspect-square max-h-[260px] sm:max-h-[320px] md:max-h-[360px] mx-auto w-full bg-gradient-to-b from-slate-100 via-slate-50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-black rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 sm:p-6 shadow-xl cursor-grab active:cursor-grabbing group"
                    >
                      {modalMediaMode === 'photo' || !selectedModalDiamond.videoUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Modal photo loading indicator */}
                          {!modalImageLoaded && !modalImageError && (
                            <div
                              data-testid="modal-image-loading"
                              className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-100/60 dark:bg-slate-950/60 backdrop-blur-sm select-none"
                            >
                              <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3" />
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Loading diamond photo...</span>
                            </div>
                          )}

                          {/* Modal photo error / fallback indicator */}
                          {modalImageError && (
                            <div
                              data-testid="modal-image-fallback"
                              className="flex flex-col items-center justify-center p-6 text-center select-none"
                            >
                              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                                <DiamondShapeIcon shape={selectedModalDiamond?.shape || 'Round Brilliant'} className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <span className="text-xs font-mono text-slate-400">Loading media</span>
                            </div>
                          )}

                          {/* Modal photo image */}
                          {safeSrc((selectedModalDiamond.images && selectedModalDiamond.images[selectedImageIndex]) || selectedModalDiamond.imageUrl) && !modalImageError && (
                            <img
                              ref={(node) => {
                                if (node && node.complete && node.naturalWidth > 0) {
                                  setModalImageLoaded(true);
                                }
                              }}
                              src={safeSrc((selectedModalDiamond.images && selectedModalDiamond.images[selectedImageIndex]) || selectedModalDiamond.imageUrl)}
                              alt={selectedModalDiamond.title}
                              onLoad={() => setModalImageLoaded(true)}
                              onError={() => setModalImageError(true)}
                              data-testid="modal-diamond-image"
                              style={{ transform: `rotate(${dragRotationAngle}deg)` }}
                              className={`w-full h-full object-contain filter brightness-105 drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] transition-all duration-300 ${modalImageLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <video
                            ref={modalVideoRef}
                            src={safeSrc(selectedModalDiamond.videoUrl)}
                            poster={safeSrc(selectedModalDiamond.imageUrl)}
                            autoPlay={modalIsPlaying}
                            loop
                            muted={modalIsMuted}
                            playsInline
                            className="w-full h-full object-contain filter brightness-105 drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] cursor-pointer"
                            onClick={() => setModalIsPlaying(!modalIsPlaying)}
                          />

                          {/* Central Play Overlay Button when paused in Modal */}
                          {!modalIsPlaying && (
                            <div
                              onClick={() => setModalIsPlaying(true)}
                              className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 transition flex items-center justify-center cursor-pointer z-10"
                            >
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition ring-4 ring-emerald-400/30">
                                <Play size={26} className="ml-1 fill-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Video Loop Indicator */}
                      {modalMediaMode === 'video' && selectedModalDiamond.videoUrl && modalIsPlaying && (
                        <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg z-10">
                          <RotateCw size={12} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                          <span>360° HD Loop</span>
                        </div>
                      )}

                      {/* Media Mode Toggle (Top Right) */}
                      {selectedModalDiamond.videoUrl && (
                        <div className="absolute top-2.5 right-2.5 flex bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 backdrop-blur-md z-10">
                          <button
                            onClick={() => setModalMediaMode('video')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition cursor-pointer flex items-center gap-1 ${modalMediaMode === 'video'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                          >
                            <Video size={12} />
                            <span>360° Video</span>
                          </button>
                          <button
                            onClick={() => {
                              setModalMediaMode('photo');
                              setModalImageLoaded(false);
                              setModalImageError(false);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono transition cursor-pointer flex items-center gap-1 ${modalMediaMode === 'photo'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                          >
                            <ImageIcon size={12} />
                            <span>Photo</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Multi-Photo Thumbnails Gallery */}
                    {selectedModalDiamond.images && selectedModalDiamond.images.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {selectedModalDiamond.images.map((imgSrc, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedImageIndex(idx);
                              setModalMediaMode('photo');
                              setModalImageLoaded(false);
                              setModalImageError(false);
                            }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border overflow-hidden shrink-0 transition cursor-pointer ${modalMediaMode === 'photo' && selectedImageIndex === idx
                              ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                              : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                              }`}
                          >
                            <img src={(imgSrc && String(imgSrc).trim().length > 0) ? imgSrc : undefined} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Video Controls Bar */}
                    {modalMediaMode === 'video' && selectedModalDiamond.videoUrl && (
                      <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-xs font-mono shadow-inner">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModalIsPlaying(!modalIsPlaying)}
                            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 font-bold"
                            title={modalIsPlaying ? 'Pause Video' : 'Play Video'}
                          >
                            {modalIsPlaying ? (
                              <>
                                <Pause size={15} className="fill-slate-800 dark:fill-slate-200" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play size={15} className="fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400 ml-0.5" />
                                <span>Play</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setModalIsMuted(!modalIsMuted)}
                            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                            title={modalIsMuted ? 'Unmute Audio' : 'Mute Audio'}
                          >
                            {modalIsMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>
                        </div>

                        <div className="flex items-center gap-1 bg-white dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs">
                          <span className="text-slate-500 mr-0.5">Speed:</span>
                          {[0.5, 1, 1.5, 2].map((sp) => (
                            <button
                              key={sp}
                              onClick={() => setModalPlaybackSpeed(sp)}
                              className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg font-bold transition cursor-pointer ${modalPlaybackSpeed === sp
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                              {sp}x
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column: Item Specifications Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-400 uppercase">{selectedModalDiamond.category}</div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">{selectedModalDiamond.title}</h2>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Wholesale Price</div>
                      <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{selectedModalDiamond.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Shape</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.shape}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Carat Weight</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">{selectedModalDiamond.carat}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Color Grade</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.color}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Clarity Grade</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.clarity}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Cut Grade</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.cut || '3X EX'}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Cert Body</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">{selectedModalDiamond.cert}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[10px]">Cert Report #</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.certNumber || selectedModalDiamond.id}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Polish</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.polish || 'Excellent'}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Symmetry</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.symmetry || 'Excellent'}</span>
                    </div>
                    {selectedModalDiamond.table && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Table %</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.table}</span>
                      </div>
                    )}
                    {selectedModalDiamond.depth && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Depth %</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.depth}</span>
                      </div>
                    )}
                    {selectedModalDiamond.measurements && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-3">
                        <span className="text-slate-400 block text-[10px]">Dimensions</span>
                        <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedModalDiamond.measurements}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      openQuoteModal({
                        category: selectedModalDiamond.category,
                        specs: `Requesting USD Quote:\n${selectedModalDiamond.title}\nID: ${selectedModalDiamond.id}\nCarat: ${selectedModalDiamond.carat}\nShape: ${selectedModalDiamond.shape}\nColor: ${selectedModalDiamond.color}\nClarity: ${selectedModalDiamond.clarity}\nCert #: ${selectedModalDiamond.certNumber}\nPrice: ${selectedModalDiamond.price}`
                      })
                    }
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Request Official USD Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        isOpen={Boolean(deleteConfirmDiamond)}
        diamond={deleteConfirmDiamond}
        onClose={() => setDeleteConfirmDiamond(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={Boolean(editingDiamond)}
        diamond={editingDiamond}
        onClose={() => setEditingDiamond(null)}
        onSave={handleSaveEditedProduct}
      />
    </div>
  );
};

export default ProductsPage;

