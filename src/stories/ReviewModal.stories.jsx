import React, { useState } from 'react';
import { ReviewModal } from '../components/ReviewModal';

export default {
  title: 'Reviews/ReviewModal',
  component: ReviewModal,
  parameters: {
    docs: {
      description: {
        component: 'Review submission modal capturing verified buyer reviews, star ratings, bench jeweler roles, and optical quality scores.',
      },
    },
  },
};

const ReviewModalWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-950/60">
      <div className="text-center mb-4">
        <h4 className="text-sm font-bold text-white mb-1">Review Submission Modal</h4>
        <p className="text-xs text-slate-400">Allows trade partners to rate stones and submit feedback</p>
      </div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
        >
          Open Review Modal
        </button>
      )}
      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmitReview={(review) => {
          alert(`Submitted review from ${review.author}: ${review.title}`);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export const OpenReviewSubmission = {
  render: () => <ReviewModalWrapper />,
};
