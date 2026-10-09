import React, { useState } from 'react';
import { DeleteProductModal } from '../components/DeleteProductModal';

const sampleDiamond = {
  id: 'custom-1791451187213-393',
  title: '1.50 Carat Round Brilliant IGI Certified Lab-grown Diamond',
  shape: 'Round Brilliant',
  carat: '1.50 Ct',
  color: 'D',
  clarity: 'VVS1',
  cert: 'IGI Certified',
  certNumber: 'CERT-77440695',
  price: '$1,500.00',
  imageUrl: '/assets/valam/images/custom-1791451187213-393.jpg',
};

export default {
  title: 'Modals/DeleteProductModal',
  component: DeleteProductModal,
  parameters: {
    docs: {
      description: {
        component: 'Confirmation dialog preventing accidental removal of inventory items, displaying product certificate number and warning message.',
      },
    },
  },
};

const DeleteModalWrapper = ({ diamond }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 border border-dashed border-rose-900/40 rounded-2xl bg-slate-950/60">
      <div className="text-center mb-4">
        <h4 className="text-sm font-bold text-white mb-1">Delete Modal Trigger</h4>
        <p className="text-xs text-slate-400">Target stone: {diamond.title}</p>
      </div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
        >
          Re-open Delete Confirmation
        </button>
      )}
      <DeleteProductModal
        isOpen={isOpen}
        diamond={diamond}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          alert(`Confirmed deletion of diamond ${diamond.id}`);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export const ConfirmDiamondDeletion = {
  render: () => <DeleteModalWrapper diamond={sampleDiamond} />,
};
