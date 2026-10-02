import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ShopProvider } from '../context/ShopContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { QuoteModal } from '../components/QuoteModal';
import { AddProductModal } from '../components/AddProductModal';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
}
