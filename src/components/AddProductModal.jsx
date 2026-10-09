import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { DeleteProductModal } from './DeleteProductModal';
import { EditProductModal } from './EditProductModal';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Video as VideoIcon,
  CheckCircle2,
  Download,
  Sparkles,
  Layers,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Copy,
  Check,
  Package,
  Eye,
  RefreshCw
} from 'lucide-react';

const SHAPE_OPTIONS = [
  'Round Brilliant',
  'Oval',
  'Emerald',
  'Cushion',
  'Radiant',
  'Pear',
  'Princess',
  'Marquise',
  'Heart',
  'Asscher',
  'Hexagon'
];

const CATEGORY_OPTIONS = [
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

const FIELD_SCHEMA = [
  {
    key: 'shape',
    label: 'Diamond Shape',
    type: 'String',
    required: true,
    category: 'Grading',
    description: 'The geometry/facet pattern of the diamond.',
    example: 'Round Brilliant / Oval / Emerald',
    options: SHAPE_OPTIONS.join(', ')
  },
  {
    key: 'caratValue',
    label: 'Carat Weight (Ct)',
    type: 'Number',
    required: true,
    category: 'Grading',
    description: 'Numeric weight of the diamond in carats.',
    example: '2.50'
  },
  {
    key: 'color',
    label: 'Color Grade',
    type: 'String',
    required: true,
    category: 'Grading',
    description: 'D (Colorless) through J (Near Colorless).',
    example: 'D / E / F / G',
    options: 'D, E, F, G, H, I, J'
  },
  {
    key: 'clarity',
    label: 'Clarity Grade',
    type: 'String',
    required: true,
    category: 'Grading',
    description: 'Inclusion grade of the diamond.',
    example: 'VVS1 / VS1 / FL',
    options: 'FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2'
  },
  {
    key: 'cut',
    label: 'Cut Grade',
    type: 'String',
    required: false,
    category: 'Grading',
    description: 'Overall cut quality rating.',
    example: 'Ideal / Excellent',
    options: 'Ideal, Excellent, Very Good, Good'
  },
  {
    key: 'priceValue',
    label: 'Price (USD $)',
    type: 'Number',
    required: true,
    category: 'Pricing',
    description: 'Wholesale B2B price in USD dollars.',
    example: '1850.00'
  },
  {
    key: 'cert',
    label: 'Certificate Lab',
    type: 'String',
    required: false,
    category: 'Certification',
    description: 'Grading authority lab name.',
    example: 'IGI Certified / GIA Certified',
    options: 'IGI Certified, GIA Certified, GCAL 8X Certified, HRD Certified'
  },
  {
    key: 'certNumber',
    label: 'Certificate Number',
    type: 'String',
    required: false,
    category: 'Certification',
    description: 'Unique report identification number.',
    example: 'LG58291039'
  },
  {
    key: 'certUrl',
    label: 'Certificate Verification URL',
    type: 'URL String',
    required: false,
    category: 'Certification',
    description: 'Direct link to verify grading report online.',
    example: 'https://www.igi.org/verify-your-report?r=LG58291039'
  },
  {
    key: 'imageUrl',
    label: 'Primary Photo URL',
    type: 'URL / Base64',
    required: false,
    category: 'Media (Photo)',
    description: 'Main product cover photograph asset.',
    example: 'https://cdn.shopify.com/.../diamond.jpg'
  },
  {
    key: 'images',
    label: 'Photo Gallery List',
    type: 'Array of URLs',
    required: false,
    category: 'Media (Photo)',
    description: 'Multiple high-resolution photo scans.',
    example: '["photo1.jpg", "photo2.jpg"]'
  },
  {
    key: 'videoUrl',
    label: '360° Video Spin URL',
    type: 'MP4 / WebM URL',
    required: false,
    category: 'Media (Video)',
    description: 'HD 360° interactive video loop URL or file.',
    example: '/videos/emerald_360.mp4'
  },
  {
    key: 'dimensions',
    label: 'Dimensions (mm)',
    type: 'String',
    required: false,
    category: 'Measurements',
    description: 'Length x Width x Depth in millimeters.',
    example: '10.20 x 7.50 x 4.80 mm'
  },
  {
    key: 'table',
    label: 'Table Percentage (%)',
    type: 'String',
    required: false,
    category: 'Measurements',
    description: 'Table size percentage.',
    example: '57.0%'
  },
  {
    key: 'depth',
    label: 'Depth Percentage (%)',
    type: 'String',
    required: false,
    category: 'Measurements',
    description: 'Total depth percentage.',
    example: '62.5%'
  },
  {
    key: 'polish',
    label: 'Polish Grade',
    type: 'String',
    required: false,
    category: 'Grading',
    description: 'Surface finish quality.',
    example: 'Excellent'
  },
  {
    key: 'symmetry',
    label: 'Symmetry Grade',
    type: 'String',
    required: false,
    category: 'Grading',
    description: 'Facet alignment quality.',
    example: 'Excellent'
  },
  {
    key: 'fluorescence',
    label: 'Fluorescence',
    type: 'String',
    required: false,
    category: 'Grading',
    description: 'UV light glow response.',
    example: 'None / Faint / Medium'
  },
  {
    key: 'ratio',
    label: 'Length-to-Width Ratio',
    type: 'String',
    required: false,
    category: 'Measurements',
    description: 'L/W ratio calculation.',
    example: '1.36'
  },
  {
    key: 'naturalOrLab',
    label: 'Diamond Origin',
    type: 'String',
    required: false,
    category: 'General',
    description: 'Lab-grown vs Natural diamond.',
    example: 'Lab-grown'
  }
];

const SAMPLE_BULK_DIAMONDS = [
  {
    title: '3.25 Carat Oval IGI Certified Lab-Grown Diamond',
    shape: 'Oval',
    caratValue: 3.25,
    carat: '3.25 Ct',
    color: 'D',
    colorTier: 'Colorless',
    clarity: 'VVS1',
    clarityTier: 'Very Very Slightly Included',
    cut: 'Ideal',
    cert: 'IGI Certified',
    certNumber: 'LG98765432',
    certUrl: 'https://www.igi.org/verify-your-report?r=LG98765432',
    priceValue: 2450.00,
    price: '$2,450.00',
    dimensions: '11.80 x 8.10 x 5.10 mm',
    table: '58.0%',
    depth: '62.0%',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    ratio: '1.45',
    naturalOrLab: 'Lab-grown',
    category: 'diamond',
    productType: 'diamond',
    isTripleExcellent: true,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
    videoUrl: '/videos/emerald_360.mp4'
  },
  {
    title: '2.10 Carat Emerald Cut GIA Certified Lab-Grown Diamond',
    shape: 'Emerald',
    caratValue: 2.10,
    carat: '2.10 Ct',
    color: 'E',
    colorTier: 'Colorless',
    clarity: 'VS1',
    clarityTier: 'Very Slightly Included',
    cut: 'Excellent',
    cert: 'GIA Certified',
    certNumber: 'GIA54321098',
    certUrl: 'https://www.gia.edu/report-check?reportno=54321098',
    priceValue: 1890.00,
    price: '$1,890.00',
    dimensions: '8.90 x 6.20 x 4.10 mm',
    table: '64.0%',
    depth: '66.0%',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    ratio: '1.43',
    naturalOrLab: 'Lab-grown',
    category: 'diamond',
    productType: 'diamond',
    isTripleExcellent: true,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
    videoUrl: '/videos/emerald_360.mp4'
  },
  {
    title: '4.50 Carat Cushion GCAL 8X Certified Lab-Grown Diamond',
    shape: 'Cushion',
    caratValue: 4.50,
    carat: '4.50 Ct',
    color: 'F',
    colorTier: 'Colorless',
    clarity: 'IF',
    clarityTier: 'Internally Flawless',
    cut: 'Ideal',
    cert: 'GCAL 8X Certified',
    certNumber: 'GCAL33221100',
    certUrl: 'https://www.gcalusa.com/certificate-search.html?cert=33221100',
    priceValue: 4800.00,
    price: '$4,800.00',
    dimensions: '10.50 x 10.40 x 6.80 mm',
    table: '59.0%',
    depth: '64.5%',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    ratio: '1.01',
    naturalOrLab: 'Lab-grown',
    category: 'diamond',
    productType: 'diamond',
    isTripleExcellent: true,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'],
    videoUrl: '/videos/emerald_360.mp4'
  }
];

export const AddProductModal = () => {
  const {
    isAddProductModalOpen,
    closeAddProductModal,
    activeAddProductTab,
    setActiveAddProductTab,
    addCustomDiamond,
    customDiamonds,
    removeCustomDiamond,
    clearCustomDiamonds,
    updateDiamond
  } = useShop();

  // Notification & Delete / Edit state
  const [toastMessage, setToastMessage] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Single Diamond Form State
  const [singleForm, setSingleForm] = useState({
    title: '',
    shape: 'Round Brilliant',
    caratValue: '1.50',
    color: 'D',
    clarity: 'VVS1',
    cut: 'Ideal',
    cert: 'IGI Certified',
    certNumber: '',
    certUrl: '',
    priceValue: '1500',
    dimensions: '',
    table: '57.0%',
    depth: '62.0%',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    ratio: '1.00',
    category: 'diamond',
    naturalOrLab: 'Lab-grown'
  });

  // Photo Section Upload State (SEPARATE FROM VIDEO)
  const [photoUrls, setPhotoUrls] = useState([]);
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const photoFileInputRef = useRef(null);

  // Video Section Upload State (SEPARATE FROM PHOTO)
  const [videoUrl, setVideoUrl] = useState('/videos/emerald_360.mp4');
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const [videoIsMuted, setVideoIsMuted] = useState(true);
  const videoFileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  // Available Fields Schema Tab Filter
  const [schemaFilter, setSchemaFilter] = useState('All');
  const [copiedHeaders, setCopiedHeaders] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const toastTimerRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    if (isAddProductModalOpen) {
      setIsFormDirty(false);
      setShowUnsavedModal(false);
    }
  }, [isAddProductModalOpen]);

  const handleAttemptClose = () => {
    if (isFormDirty) {
      setShowUnsavedModal(true);
      return;
    }
    setIsFormDirty(false);
    setShowUnsavedModal(false);
    closeAddProductModal();
  };

  const handleConfirmDiscard = () => {
    setShowUnsavedModal(false);
    setIsFormDirty(false);
    closeAddProductModal();
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!isAddProductModalOpen) return;

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleAttemptClose();
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
  }, [isAddProductModalOpen, isFormDirty, closeAddProductModal]);

  if (!isAddProductModalOpen) return null;

  // Single Form Input Handler
  const handleSingleFormChange = (e) => {
    const { name, value } = e.target;
    setIsFormDirty(true);
    setSingleForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Photo Upload Helpers (SEPARATE SECTION)
  const handlePhotoFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setIsFormDirty(true);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrls((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`Added ${files.length} photo(s) to gallery.`);
  };

  const handleAddPhotoByUrl = () => {
    if (!photoInputUrl.trim()) return;
    setIsFormDirty(true);
    setPhotoUrls((prev) => [...prev, photoInputUrl.trim()]);
    setPhotoInputUrl('');
    showToast('Photo URL added to gallery.');
  };

  const handleRemovePhoto = (index) => {
    setIsFormDirty(true);
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Video Upload Helpers (SEPARATE SECTION)
  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsFormDirty(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoUrl(event.target.result);
        showToast('360° Video uploaded successfully! Stored permanently.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideoByUrl = () => {
    if (!videoInputUrl.trim()) return;
    setIsFormDirty(true);
    setVideoUrl(videoInputUrl.trim());
    setVideoInputUrl('');
    showToast('Video URL updated! Play preview below to verify.');
  };

  // Single Diamond Form Submission
  const handleSingleDiamondSubmit = (e) => {
    e.preventDefault();

    const caratNum = parseFloat(singleForm.caratValue) || 1.0;
    const priceNum = parseFloat(singleForm.priceValue) || 1000.0;

    const formattedTitle =
      singleForm.title.trim() ||
      `${caratNum.toFixed(2)} Carat ${singleForm.shape} ${singleForm.cert} ${singleForm.naturalOrLab} Diamond`;

    const mainPhoto =
      photoUrls.length > 0
        ? photoUrls[0]
        : '';

    const newDiamond = {
      title: formattedTitle,
      shape: singleForm.shape,
      caratValue: caratNum,
      carat: `${caratNum.toFixed(2)} Ct`,
      color: singleForm.color,
      colorTier: ['D', 'E', 'F'].includes(singleForm.color) ? 'Colorless' : 'Near Colorless',
      clarity: singleForm.clarity,
      clarityTier: ['FL', 'IF'].includes(singleForm.clarity) ? 'Flawless' : 'Very Very Slightly Included',
      cut: singleForm.cut,
      cert: singleForm.cert,
      certNumber: singleForm.certNumber || `CERT-${Math.floor(10000000 + Math.random() * 90000000)}`,
      certUrl: singleForm.certUrl || 'https://www.igi.org',
      priceValue: priceNum,
      price: `$${priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      dimensions: singleForm.dimensions || '10.00 x 7.50 x 4.50 mm',
      table: singleForm.table || '57.0%',
      depth: singleForm.depth || '62.0%',
      polish: singleForm.polish,
      symmetry: singleForm.symmetry,
      fluorescence: singleForm.fluorescence,
      ratio: singleForm.ratio || '1.00',
      naturalOrLab: singleForm.naturalOrLab,
      category: singleForm.category,
      productType: 'diamond',
      isTripleExcellent: singleForm.cut === 'Ideal' || singleForm.cut === 'Excellent',
      imageUrl: mainPhoto,
      image: mainPhoto,
      images: photoUrls.length > 0 ? photoUrls : [mainPhoto],
      videoUrl: videoUrl,
      video: videoUrl
    };

    addCustomDiamond(newDiamond);
    setIsFormDirty(false);
    showToast(`✨ Diamond "${formattedTitle}" successfully created & published to Products Page!`);

    // Reset photo & video state
    setPhotoUrls([]);
    setVideoUrl('/videos/emerald_360.mp4');
  };

  const copyCsvHeadersToClipboard = () => {
    const headers = FIELD_SCHEMA.map((f) => f.key).join(',');
    navigator.clipboard.writeText(headers);
    setCopiedHeaders(true);
    setTimeout(() => setCopiedHeaders(false), 2500);
    showToast('Copied CSV Column Headers to clipboard!');
  };

  const filteredSchema = FIELD_SCHEMA.filter((item) => {
    if (schemaFilter === 'All') return true;
    if (schemaFilter === 'Required') return item.required;
    return item.category === schemaFilter;
  });

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 md:p-6 modal-backdrop-overlay animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAttemptClose();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="relative w-full max-w-3xl lg:max-w-4xl max-h-[88vh] sm:max-h-[85vh] my-auto self-center flex flex-col bg-white dark:bg-[#0B131F] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-[9991] px-5 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold animate-bounce ${toastMessage.type === 'error'
              ? 'bg-rose-950 border-rose-700 text-rose-200'
              : 'bg-emerald-950 border-emerald-700 text-emerald-200'
              }`}
          >
            <Sparkles size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {/* Modal Top Header Bar */}
        <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B131F] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Plus size={22} />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold block">
                Nivaan Design Inventory Suite
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Add & Import Certified Diamonds
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleAttemptClose}
              className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-800 transition cursor-pointer"
              aria-label="Close add product modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-5 sm:px-8 bg-slate-100/80 dark:bg-[#080E18] border-b border-slate-200 dark:border-slate-800/80 flex overflow-x-auto gap-2 py-2 shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveAddProductTab('single')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${activeAddProductTab === 'single'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Sparkles size={16} />
            <span>Single Diamond Import</span>
          </button>

          <button
            onClick={() => setActiveAddProductTab('fields')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${activeAddProductTab === 'fields'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Layers size={16} />
            <span>Available Fields & Schema</span>
          </button>

          <button
            onClick={() => setActiveAddProductTab('manage')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${activeAddProductTab === 'manage'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Package size={16} />
            <span>Manage Added Products ({customDiamonds.length})</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8 bg-white dark:bg-[#0B131F]">

          {/* TAB 1: SINGLE DIAMOND IMPORT */}
          {activeAddProductTab === 'single' && (
            <form onSubmit={handleSingleDiamondSubmit} className="space-y-8">

              {/* Basic Product Info Grid */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-500" />
                  <span>1. General Diamond Specifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* Title */}
                  <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Product Title (Optional - auto-generated if left blank)
                    </label>
                    <input
                      type="text"
                      name="title"
                      data-testid="diamond-title-input"
                      value={singleForm.title}
                      onChange={handleSingleFormChange}
                      placeholder="e.g. 2.50 Carat Oval IGI Certified Lab-Grown Diamond"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Shape */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Diamond Shape *
                    </label>
                    <select
                      name="shape"
                      value={singleForm.shape}
                      onChange={handleSingleFormChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {SHAPE_OPTIONS.map((sh) => (
                        <option key={sh} value={sh}>{sh}</option>
                      ))}
                    </select>
                  </div>

                  {/* Carat */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Carat Weight (Ct) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="caratValue"
                      value={singleForm.caratValue}
                      onChange={handleSingleFormChange}
                      required
                      placeholder="1.50"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Wholesale Price (USD $) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="priceValue"
                      value={singleForm.priceValue}
                      onChange={handleSingleFormChange}
                      required
                      placeholder="1500.00"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Color Grade *
                    </label>
                    <select
                      name="color"
                      value={singleForm.color}
                      onChange={handleSingleFormChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clarity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Clarity Grade *
                    </label>
                    <select
                      name="clarity"
                      value={singleForm.clarity}
                      onChange={handleSingleFormChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'].map((cl) => (
                        <option key={cl} value={cl}>{cl}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cut */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Cut Grade
                    </label>
                    <select
                      name="cut"
                      value={singleForm.cut}
                      onChange={handleSingleFormChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {['Ideal', 'Excellent', 'Very Good', 'Good'].map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cert */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Certificate Authority
                    </label>
                    <select
                      name="cert"
                      value={singleForm.cert}
                      onChange={handleSingleFormChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {['IGI Certified', 'GIA Certified', 'GCAL 8X Certified', 'HRD Certified', 'Uncertified'].map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cert Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Certificate Report Number
                    </label>
                    <input
                      type="text"
                      name="certNumber"
                      value={singleForm.certNumber}
                      onChange={handleSingleFormChange}
                      placeholder="e.g. LG58291039"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Cert URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Certificate Verification URL
                    </label>
                    <input
                      type="url"
                      name="certUrl"
                      value={singleForm.certUrl}
                      onChange={handleSingleFormChange}
                      placeholder="https://www.igi.org/verify-your-report..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Catalog Category
                    </label>
                    <select
                      name="category"
                      value={singleForm.category}
                      onChange={handleSingleFormChange}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Dimensions (mm)
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={singleForm.dimensions}
                      onChange={handleSingleFormChange}
                      placeholder="10.20 x 7.50 x 4.80 mm"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Table % */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      Table %
                    </label>
                    <input
                      type="text"
                      name="table"
                      value={singleForm.table}
                      onChange={handleSingleFormChange}
                      placeholder="57.0%"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SEPARATE MEDIA SECTIONS: PHOTO UPLOAD SECTION & VIDEO UPLOAD SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">

                {/* SECTION A: PHOTO UPLOAD SECTION */}
                <div className="bg-emerald-50/50 dark:bg-slate-900/60 border-2 border-emerald-500/30 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md">
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          Photo Upload Section
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Product Photography & Scan Images (Separated Section)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full font-bold">
                      {photoUrls.length} Photo(s)
                    </span>
                  </div>

                  {/* Photo File Upload Box */}
                  <div
                    onClick={() => photoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-400/50 dark:border-emerald-600/40 hover:border-emerald-500 bg-white dark:bg-slate-950/80 rounded-2xl p-4 text-center cursor-pointer transition group"
                  >
                    <input
                      ref={photoFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      data-testid="photo-file-input"
                      onChange={handlePhotoFileUpload}
                      className="hidden"
                    />
                    <Upload size={24} className="mx-auto text-emerald-500 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      Click to upload photos from device
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP (Multiple allowed)
                    </p>
                  </div>

                  {/* Photo Gallery Grid Preview */}
                  {photoUrls.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                      {photoUrls.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 aspect-square bg-slate-900">
                          <img src={(url && String(url).trim().length > 0) ? url : undefined} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION B: VIDEO UPLOAD SECTION */}
                <div className="bg-amber-50/50 dark:bg-slate-900/60 border-2 border-amber-500/30 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-600 text-white shadow-md">
                        <VideoIcon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          Video Upload Section
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          360° HD Spin Video & MP4 (Separated Section)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full font-bold">
                      {videoUrl ? '1 Video Selected' : 'No Video'}
                    </span>
                  </div>

                  {/* Video File Upload Box */}
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-400/50 dark:border-amber-600/40 hover:border-amber-500 bg-white dark:bg-slate-950/80 rounded-2xl p-4 text-center cursor-pointer transition group"
                  >
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/*"
                      data-testid="video-file-input"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                    <Upload size={24} className="mx-auto text-amber-500 group-hover:scale-110 transition" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      Click to upload 360° video spin file
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      MP4, WEBM format (360 HD spin recommended)
                    </p>
                  </div>

                  {/* Live Video Preview Box */}
                  {videoUrl && (
                    <div className="space-y-2 pt-1">
                      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-amber-300 dark:border-amber-800 shadow-md">
                        <video
                          ref={videoPreviewRef}
                          src={videoUrl && String(videoUrl).trim().length > 0 ? videoUrl : undefined}
                          loop
                          muted={videoIsMuted}
                          playsInline
                          className="w-full h-full object-contain"
                        />

                        {/* Video Overlay Play Controls */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (videoPreviewRef.current) {
                                  if (videoIsPlaying) {
                                    videoPreviewRef.current.pause();
                                  } else {
                                    videoPreviewRef.current.play();
                                  }
                                  setVideoIsPlaying(!videoIsPlaying);
                                }
                              }}
                              className="p-1 hover:text-amber-400 transition cursor-pointer"
                            >
                              {videoIsPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <span className="text-[10px] font-mono text-slate-300">
                              {videoIsPlaying ? 'Playing Spin Preview' : 'Paused'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setVideoIsMuted(!videoIsMuted)}
                            className="p-1 hover:text-amber-400 transition cursor-pointer"
                          >
                            {videoIsMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Submit Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddProductModal}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  data-testid="publish-diamond-button"
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Publish Diamond to Store</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: AVAILABLE FIELDS & SCHEMA */}
          {activeAddProductTab === 'fields' && (
            <div className="space-y-6">

              {/* Header Box */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950 p-6 rounded-3xl border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                    Developer & Inventory Data Schema
                  </span>
                  <h3 className="text-lg font-extrabold text-white">
                    Available Diamond Product Fields ({FIELD_SCHEMA.length} Attributes)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Use these field names for single form inputs, API integrations, and CSV file column headers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyCsvHeadersToClipboard}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  {copiedHeaders ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedHeaders ? 'Headers Copied!' : 'Copy CSV Header Row'}</span>
                </button>
              </div>

              {/* Sub-Filter Bar */}
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
                {['All', 'Required', 'Grading', 'Pricing', 'Certification', 'Media (Photo)', 'Media (Video)', 'Measurements'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSchemaFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${schemaFilter === cat
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Schema Table Grid */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-3">Field Key</th>
                      <th className="p-3">Label & Category</th>
                      <th className="p-3">Data Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description & Allowed Values</th>
                      <th className="p-3">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                    {filteredSchema.map((field) => (
                      <tr key={field.key} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                          {field.key}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-white font-sans">
                            {field.label}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {field.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {field.type}
                        </td>
                        <td className="p-3">
                          {field.required ? (
                            <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded font-bold text-[10px]">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded text-[10px]">
                              Optional
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-sans text-slate-700 dark:text-slate-300 space-y-1">
                          <div>{field.description}</div>
                          {field.options && (
                            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                              Options: {field.options}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          {field.example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE ADDED PRODUCTS */}
          {activeAddProductTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    User-Added Custom Diamonds ({customDiamonds.length})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    These products are currently published to the Products Page.
                  </p>
                </div>

                {customDiamonds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      let shouldClear = true;

                      if (typeof window !== 'undefined') {
                        try {
                          const confirmFn = window.confirm;
                          if (typeof confirmFn === 'function') {
                            const result = confirmFn('Are you sure you want to clear all custom added diamonds?');
                            shouldClear = typeof result === 'boolean' ? result : true;
                          }
                        } catch {
                          shouldClear = true;
                        }
                      }

                      if (shouldClear) {
                        clearCustomDiamonds();
                        showToast('Cleared all custom diamonds.');
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Clear All Custom Items</span>
                  </button>
                )}
              </div>

              {customDiamonds.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Package size={40} className="mx-auto text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No Custom Products Added Yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Use the 'Single Diamond Import' tab above to add custom products to your catalog.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveAddProductTab('single')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md"
                  >
                    Add First Diamond
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="p-3">Media</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Shape</th>
                        <th className="p-3">Carat</th>
                        <th className="p-3">Color/Clarity</th>
                        <th className="p-3">Price ($)</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                      {customDiamonds.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 relative">
                              <img src={((item.imageUrl && String(item.imageUrl).trim().length > 0) ? item.imageUrl : (item.image && String(item.image).trim().length > 0 ? item.image : undefined))} alt="" className="w-full h-full object-cover" />
                              {item.videoUrl && (
                                <span className="absolute bottom-0 right-0 p-0.5 bg-amber-500 text-black text-[8px] font-bold">
                                  360°
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{item.shape}</td>
                          <td className="p-3">{item.carat}</td>
                          <td className="p-3">{item.color} / {item.clarity}</td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{item.price}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingItem(item)}
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm"
                                title="Edit Item"
                                data-testid={`edit-manage-item-${item.id}`}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingItem(item)}
                                className="h-8 w-8 text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm"
                                title="Delete Item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteProductModal
            isOpen={Boolean(deletingItem)}
            diamond={deletingItem}
            onClose={() => setDeletingItem(null)}
            onConfirm={() => {
              if (deletingItem) {
                removeCustomDiamond(deletingItem.id);
                showToast(`Removed item ${deletingItem.title || deletingItem.id}`);
                setDeletingItem(null);
              }
            }}
          />

          {/* Edit Product Modal */}
          <EditProductModal
            isOpen={Boolean(editingItem)}
            diamond={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={async (updated) => {
              await updateDiamond(updated);
              showToast(`Updated item ${updated.title || updated.id}`);
              setEditingItem(null);
            }}
          />

          {/* Unsaved Changes Confirmation Modal */}
          <UnsavedChangesModal
            isOpen={showUnsavedModal}
            onClose={() => setShowUnsavedModal(false)}
            onConfirm={handleConfirmDiscard}
          />
        </div>
      </div>
    </div>
  );
};
