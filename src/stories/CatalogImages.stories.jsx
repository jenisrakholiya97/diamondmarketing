import React from 'react';
import { ProductCardImage, TableProductImage } from '../pages/ProductsPage';

const sampleDiamond = {
  id: 'custom-1791451187213-393',
  title: '1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond',
  shape: 'Round Brilliant',
  imageUrl: '/assets/valam/images/custom-1791451187213-393.jpg',
  images: ['/assets/valam/images/custom-1791451187213-393-0.jpg'],
};

const diamondWithoutImage = {
  id: 'missing-img-stone',
  title: 'Oval Solitaire Diamond (No Image)',
  shape: 'Oval',
  imageUrl: '',
};

export default {
  title: 'Products/CatalogImages',
  parameters: {
    docs: {
      description: {
        component: 'Resilient image components featuring progressive fade-in loading, decode checks, and geometric shape icon fallbacks.',
      },
    },
  },
};

export const CardImageLoaded = {
  render: () => (
    <div className="w-64 h-64 bg-[#050811] border border-slate-800 rounded-2xl p-4 flex items-center justify-center">
      <ProductCardImage diamond={sampleDiamond} />
    </div>
  ),
};

export const CardImageFallbackShape = {
  render: () => (
    <div className="w-64 h-64 bg-[#050811] border border-slate-800 rounded-2xl p-4 flex items-center justify-center">
      <ProductCardImage diamond={diamondWithoutImage} />
    </div>
  ),
};

export const TableThumbnail = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <TableProductImage diamond={sampleDiamond} />
      <div>
        <h4 className="text-sm font-bold text-white">{sampleDiamond.title}</h4>
        <span className="text-xs font-mono text-slate-400">Table row thumbnail with loader & fallback</span>
      </div>
    </div>
  ),
};

export const TableThumbnailFallback = {
  render: () => (
    <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <TableProductImage diamond={diamondWithoutImage} />
      <div>
        <h4 className="text-sm font-bold text-white">Missing Image Stone</h4>
        <span className="text-xs font-mono text-slate-400">Fallback geometric icon rendered</span>
      </div>
    </div>
  ),
};
