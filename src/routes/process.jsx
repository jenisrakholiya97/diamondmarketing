import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ProcessPage } from '../pages/ProcessPage';

export const Route = createFileRoute('/process')({
  component: ProcessPage,
});
