import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../pages/HomePage';

export const Route = createFileRoute('/')({
  component: HomePage,
});
