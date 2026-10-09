import React from 'react';
import { SupplyPage } from '../pages/SupplyPage';

export default {
  title: 'Pages/SupplyPage',
  component: SupplyPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Global supply matrix and B2B capabilities detailing production volumes, certified parcel distribution, and custom cutting services.',
      },
    },
  },
};

export const Default = {
  render: () => <SupplyPage />,
};
