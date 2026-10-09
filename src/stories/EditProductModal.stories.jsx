import React, { useState } from 'react';
import { EditProductModal } from '../components/EditProductModal';

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
  title: 'Modals/EditProductModal',
  component: EditProductModal,
  parameters: {
    docs: {
      description: {
        component: 'Product editor modal enabling modifications to carat, color, clarity, cut, certification, studio images, and 360° video loops.',
      },
    },
  },
};

const EditProductModalStoryWrapper = ({ initialDiamond }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [diamond, setDiamond] = useState(initialDiamond);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-slate-950/40 rounded-2xl border border-slate-800">
      <div className="text-center mb-4">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Active Product: {diamond.title}</span>
      </div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Re-open Edit Modal
        </button>
      )}
      <EditProductModal
        isOpen={isOpen}
        diamond={diamond}
        onClose={() => setIsOpen(false)}
        onSave={(updated) => {
          setDiamond({ ...diamond, ...updated });
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export const EditRoundBrilliantDiamond = {
  render: () => <EditProductModalStoryWrapper initialDiamond={sampleDiamond} />,
};

export const EditFancyShapeDiamond = {
  render: () => (
    <EditProductModalStoryWrapper
      initialDiamond={{
        ...sampleDiamond,
        id: 'custom-1791451120390-868',
        shape: 'Oval',
        title: '1.50 Carat Oval Brilliant IGI Certified Lab-grown Diamond',
        dimensions: '9.20 x 6.45 x 3.98 mm',
      }}
    />
  ),
};
