import React from 'react';
import { createRouter, createRoute, createRootRoute, createMemoryHistory, Outlet } from '@tanstack/react-router';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { AddProductModal } from './components/AddProductModal';

import { HomePage } from './pages/HomePage';
import { SupplyPage } from './pages/SupplyPage';
import { ProcessPage } from './pages/ProcessPage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ProductsPage } from './pages/ProductsPage';

export const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <ShopProvider>
        <div className="flex flex-col min-h-screen bg-[#070A0F] text-slate-100 font-sans antialiased selection:bg-emerald-600 selection:text-white">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <QuoteModal />
          <AddProductModal />
        </div>
      </ShopProvider>
    );
  },
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

export const supplyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/supply',
  component: SupplyPage,
});

export const processRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/process',
  component: ProcessPage,
});

export const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

export const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

export const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});

export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  supplyRoute,
  processRoute,
  productsRoute,
  aboutRoute,
  faqRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
]);

export function createMyRouter(initialUrl = '/') {
  return createRouter({
    routeTree,
    history: typeof window === 'undefined' ? createMemoryHistory({ initialEntries: [initialUrl] }) : undefined,
    defaultPreload: 'intent',
  });
}
