import React from 'react';
import { ProcessPage } from '../pages/ProcessPage';

export default {
  title: 'Pages/ProcessPage',
  component: ProcessPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Detailed CVD & HPHT growth, precision laser planning, automated faceting, and gemological laboratory certification walkthrough.',
      },
    },
  },
};

export const Default = {
  render: () => <ProcessPage />,
};
