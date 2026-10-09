import React from 'react';
import { AddProductModal } from '../components/AddProductModal';
import { useShop } from '../context/ShopContext';

export default {
  title: 'Modals/AddProductModal',
  component: AddProductModal,
  parameters: {
    docs: {
      description: {
        component: 'Product management modal allowing admins/traders to upload single loose certified diamonds or bulk diamond files with image/video preview and specifications.',
      },
    },
  },
};

const AddProductModalWrapper = ({ defaultTab = 'single' }) => {
  const { openAddProductModal, setActiveAddProductTab } = useShop();

  const handleOpen = () => {
    setActiveAddProductTab(defaultTab);
    openAddProductModal();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-950/60">
      <div className="text-center mb-6">
        <h4 className="text-base font-bold text-white mb-1">Add Product Modal Trigger</h4>
        <p className="text-xs text-slate-400">Allows traders on localhost or authorized admin environments to add loose diamonds</p>
      </div>
      <button
        onClick={handleOpen}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-950/50 cursor-pointer"
      >
        Open Add Product Modal ({defaultTab === 'single' ? 'Single Diamond' : 'Bulk Upload'})
      </button>
      <AddProductModal />
    </div>
  );
};

export const SingleDiamondUpload = {
  render: () => <AddProductModalWrapper defaultTab="single" />,
};

export const BulkImportUpload = {
  render: () => <AddProductModalWrapper defaultTab="bulk" />,
};
