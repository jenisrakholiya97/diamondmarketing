import React from 'react';
import { Footer } from '../components/Footer';

export default {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Trade footer featuring Surat sourcing desk coordinates, quick navigation links, compliance notices, and embedded theme switcher.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <div className="w-full bg-[#070A0F]">
      <Footer />
    </div>
  ),
};
