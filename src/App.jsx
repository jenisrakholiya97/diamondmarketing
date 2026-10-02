import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { createMyRouter } from './router';
import { ShopProvider } from './context/ShopContext';

const router = createMyRouter();

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ShopProvider>
      <AppRouter />
    </ShopProvider>
  );
}
