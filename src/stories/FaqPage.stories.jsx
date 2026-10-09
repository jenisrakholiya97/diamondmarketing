import React from 'react';
import { FaqPage } from '../pages/FaqPage';

export default {
  title: 'Pages/FaqPage',
  component: FaqPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive accordion FAQs addressing 4Cs certification (IGI/GIA), customs clearance, direct wire payments, and insured international shipping.',
      },
    },
  },
};

export const Default = {
  render: () => <FaqPage />,
};
