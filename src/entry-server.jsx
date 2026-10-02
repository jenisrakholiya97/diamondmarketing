import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterProvider } from '@tanstack/react-router';
import { createMyRouter } from './router';

export async function render(url = '/') {
  const router = createMyRouter(url);
  await router.load();
  const html = renderToString(<RouterProvider router={router} />);
  return { html };
}
