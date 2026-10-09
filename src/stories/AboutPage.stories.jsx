import React from 'react';
import { AboutPage } from '../pages/AboutPage';

export default {
  title: 'Pages/AboutPage',
  component: AboutPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Surat manufacturing heritage, direct-to-studio supply model, interactive timeline, and master gemologist accreditation.',
      },
    },
  },
};

export const Default = {
  render: () => <AboutPage />,
};
