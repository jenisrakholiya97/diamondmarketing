import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../router';
import { ProductsPage } from '../pages/ProductsPage';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});
