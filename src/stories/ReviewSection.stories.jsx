import React from 'react';
import { ReviewSection } from '../components/ReviewSection';

export default {
  title: 'Reviews/ReviewSection',
  component: ReviewSection,
  parameters: {
    docs: {
      description: {
        component: 'Verified trade client review grid showcasing ratings, optics fire scores, and review submission triggers.',
      },
    },
  },
};

export const FullReviewSection = {
  render: () => (
    <div className="max-w-6xl mx-auto py-8">
      <ReviewSection title="Verified Trade Client Feedback" />
    </div>
  ),
};

export const CompactLimitedReviews = {
  render: () => (
    <div className="max-w-4xl mx-auto py-8">
      <ReviewSection limit={3} title="Recent Studio Testimonials" />
    </div>
  ),
};
