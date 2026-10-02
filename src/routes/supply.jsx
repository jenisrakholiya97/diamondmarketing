import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { SupplyPage } from '../pages/SupplyPage';

export const Route = createFileRoute('/supply')({
  component: SupplyPage,
});
