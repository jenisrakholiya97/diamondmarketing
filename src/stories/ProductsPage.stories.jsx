import React from 'react';
import { ProductsPage } from '../pages/ProductsPage';

export default {
  title: 'Pages/ProductsPage',
  component: ProductsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Live loose diamond inventory catalog featuring multi-facet filtering (Shape, Carat, Color, Clarity, 3X EX), search, card/table view toggles, and detail inspection modals.',
      },
    },
  },
};

export const LiveInventoryCatalog = {
  render: () => <ProductsPage />,
};
