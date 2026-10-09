import React, { useState, useEffect, useRef } from 'react';
import { Edit, X, Save, Sparkles, Image as ImageIcon, Video as VideoIcon, FileText, Upload, Play, Pause, Trash2, Plus, CheckCircle } from 'lucide-react';
import { UnsavedChangesModal } from './UnsavedChangesModal';

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

const COLOR_OPTIONS = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
const CLARITY_OPTIONS = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
const CUT_OPTIONS = ['Ideal', 'Excellent', 'Very Good', 'Good', '3X EX'];
const CERT_OPTIONS = ['IGI Certified', 'GIA Certified', 'GCAL 8X Certified', 'HRD Certified'];

export const EditProductModal = ({ isOpen, diamond, onClose, onSave }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    shape: 'Round Brilliant',
    caratValue: '1.00',
    color: 'D',
    clarity: 'VVS1',
    cut: 'Ideal',
    cert: 'IGI Certified',
    certNumber: '',
    certUrl: '',
    priceValue: '1000',
    dimensions: '',
    table: '57.0%',
    depth: '62.0%',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    category: 'diamond',
    imageUrl: '',
    videoUrl: '',
    images: []
  });

  const [videoIsPlaying, setVideoIsPlaying] = useState(false);
  const photoFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !diamond) return;

    const parsedCarat = diamond.caratValue
      ? String(diamond.caratValue)
      : (diamond.carat ? String(diamond.carat).replace(/[^0-9.]/g, '') : '1.00');

    const parsedPrice = diamond.priceValue
      ? String(diamond.priceValue)
      : (diamond.price ? String(diamond.price).replace(/[^0-9.]/g, '') : '1000');

    const initialImage = diamond.imageUrl || diamond.image || '';
    const initialVideo = diamond.videoUrl || diamond.video || '';
    const initialImages = (diamond.images && diamond.images.length > 0)
      ? diamond.images
      : (initialImage ? [initialImage] : []);

    setForm({
      title: diamond.title || '',
      shape: diamond.shape || 'Round Brilliant',
      caratValue: parsedCarat,
      color: diamond.color || 'D',
      clarity: diamond.clarity || 'VVS1',
      cut: diamond.cut || 'Ideal',
      cert: diamond.cert || 'IGI Certified',
      certNumber: diamond.certNumber || '',
      certUrl: diamond.certUrl || '',
      priceValue: parsedPrice,
      dimensions: diamond.dimensions || '',
      table: diamond.table || '57.0%',
      depth: diamond.depth || '62.0%',
      polish: diamond.polish || 'Excellent',
      symmetry: diamond.symmetry || 'Excellent',
      fluorescence: diamond.fluorescence || 'None',
      category: diamond.category || 'diamond',
      imageUrl: initialImage,
      videoUrl: initialVideo,
      images: initialImages
    });
    setIsDirty(false);
    setShowUnsavedModal(false);
  }, [isOpen, diamond]);

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
      return;
    }
    setIsDirty(false);
    setShowUnsavedModal(false);
    onClose();
  };

  const handleConfirmDiscard = () => {
    setShowUnsavedModal(false);
    setIsDirty(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, isDirty, onClose]);

  if (!isOpen || !diamond) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Photo File Upload
  const handlePhotoFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsDirty(true);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        setForm((prev) => {
          const newImages = [...(prev.images || []), resultUrl];
          return {
            ...prev,
            imageUrl: resultUrl,
            images: newImages
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Video File Upload
  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDirty(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target.result;
      setForm((prev) => ({
        ...prev,
        videoUrl: resultUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diamond) return;

    setIsDirty(false);
    const numPrice = parseFloat(form.priceValue) || 0;
    const numCarat = parseFloat(form.caratValue) || 0;
    const formattedPrice = `$${numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formattedCarat = `${numCarat.toFixed(2)} Ct`;

    const updatedImages = (form.images && form.images.length > 0)
      ? form.images
      : (form.imageUrl ? [form.imageUrl] : []);

    const updatedDiamond = {
      ...diamond,
      ...form,
      title: form.title || `${formattedCarat} ${form.shape} ${form.cert} Diamond`,
      priceValue: numPrice,
      price: formattedPrice,
      caratValue: numCarat,
      carat: formattedCarat,
      image: form.imageUrl,
      imageUrl: form.imageUrl,
      images: updatedImages,
      video: form.videoUrl,
      videoUrl: form.videoUrl,
      updatedAt: new Date().toISOString()
    };

    if (onSave) {
      onSave(updatedDiamond);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 modal-backdrop-overlay animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAttemptClose();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      data-testid="edit-product-modal-overlay"
    >
      <div
        className="bg-white dark:bg-[#0B131F] border border-amber-500/30 dark:border-amber-700/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 relative animate-scaleUp my-auto self-center max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        data-testid="edit-product-modal"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Edit size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                Edit Certified Diamond Product
              </h3>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Item ID: {diamond.id}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAttemptClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            data-testid="close-edit-modal-button"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
              Product Title / Headline
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. 2.50 Carat Oval IGI Certified Lab-Grown Diamond"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
              data-testid="edit-title-input"
              required
            />
          </div>

          {/* Grid Row 1: Shape & Carat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Diamond Shape
              </label>
              <select
                name="shape"
                value={form.shape}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-shape-select"
              >
                {SHAPE_OPTIONS.map((shape) => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Carat Weight (Ct)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="caratValue"
                value={form.caratValue}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-carat-input"
                required
              />
            </div>
          </div>

          {/* Grid Row 2: Color, Clarity, Cut */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Color Grade
              </label>
              <select
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-color-select"
              >
                {COLOR_OPTIONS.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Clarity Grade
              </label>
              <select
                name="clarity"
                value={form.clarity}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-clarity-select"
              >
                {CLARITY_OPTIONS.map((cla) => (
                  <option key={cla} value={cla}>{cla}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Cut Quality
              </label>
              <select
                name="cut"
                value={form.cut}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-cut-select"
              >
                {CUT_OPTIONS.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Row 3: Price & Certificate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Wholesale Price (USD $)
              </label>
              <input
                type="number"
                step="1"
                name="priceValue"
                value={form.priceValue}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-price-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Grading Certificate Lab
              </label>
              <select
                name="cert"
                value={form.cert}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-cert-select"
              >
                {CERT_OPTIONS.map((crt) => (
                  <option key={crt} value={crt}>{crt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Row 4: Cert Number & Cert URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Certificate Report #
              </label>
              <input
                type="text"
                name="certNumber"
                value={form.certNumber}
                onChange={handleChange}
                placeholder="e.g. LG58291039"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-cert-number-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mb-1">
                Cert Verification Link URL
              </label>
              <input
                type="text"
                name="certUrl"
                value={form.certUrl}
                onChange={handleChange}
                placeholder="https://www.igi.org/verify-your-report..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                data-testid="edit-cert-url-input"
              />
            </div>
          </div>

          {/* Media Edit Section: Photo & Video Upload / Change */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Media Assets (Change Photo & 360° Video)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Photo Upload & Change */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-amber-500" />
                    <span>Product Photo</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-mono font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                    data-testid="upload-edit-photo-button"
                  >
                    <Upload size={12} />
                    <span>Upload Image</span>
                  </button>
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    onChange={handlePhotoFileUpload}
                    accept="image/*"
                    className="hidden"
                    data-testid="edit-photo-file-input"
                  />
                </div>

                {/* Photo Preview Thumbnail */}
                {form.imageUrl ? (
                  <div className="relative w-full h-32 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2 group">
                    <img
                      src={form.imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-contain filter brightness-105"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsDirty(true);
                        setForm((prev) => ({ ...prev, imageUrl: '', images: [] }));
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-md hover:bg-rose-500 transition cursor-pointer opacity-80 hover:opacity-100"
                      title="Remove photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => photoFileInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-amber-400 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-950/50"
                  >
                    <ImageIcon size={24} className="text-slate-400 mb-1" />
                    <span className="text-[11px] font-mono text-slate-500">No image set. Click to upload</span>
                  </div>
                )}
              </div>

              {/* 360° Video Upload & Change */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <VideoIcon size={15} className="text-amber-500" />
                    <span>360° Video Spin</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-mono font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                    data-testid="upload-edit-video-button"
                  >
                    <Upload size={12} />
                    <span>Upload Video</span>
                  </button>
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    onChange={handleVideoFileUpload}
                    accept="video/*"
                    className="hidden"
                    data-testid="edit-video-file-input"
                  />
                </div>

                {/* Video Preview Player */}
                {form.videoUrl ? (
                  <div className="relative w-full h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group">
                    <video
                      ref={videoPreviewRef}
                      src={form.videoUrl}
                      autoPlay={videoIsPlaying}
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
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
                      className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-slate-900/80 text-white shadow-md border border-slate-700 transition cursor-pointer hover:bg-slate-800 flex items-center gap-1 text-[10px] font-mono"
                    >
                      {videoIsPlaying ? <Pause size={12} /> : <Play size={12} />}
                      <span>{videoIsPlaying ? 'Pause' : 'Play Preview'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDirty(true);
                        setForm((prev) => ({ ...prev, videoUrl: '' }));
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-md hover:bg-rose-500 transition cursor-pointer opacity-80 hover:opacity-100"
                      title="Remove video"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-amber-400 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-950/50"
                  >
                    <VideoIcon size={24} className="text-slate-400 mb-1" />
                    <span className="text-[11px] font-mono text-slate-500">No 360° video set. Click to upload</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleAttemptClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer"
              data-testid="cancel-edit-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-600/30 transition cursor-pointer flex items-center gap-2"
              data-testid="save-product-button"
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={handleConfirmDiscard}
      />
    </div>
  );
};

