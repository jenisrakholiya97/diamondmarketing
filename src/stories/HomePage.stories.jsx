import React from 'react';
import { HomePage } from '../pages/HomePage';

export default {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Primary trade portal landing page including hero value proposition, quick inventory stats, 360 loose stone previews, and ethical origin guarantees.',
      },
    },
  },
};

export const Default = {
  render: () => <HomePage />,
};
