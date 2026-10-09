import React from 'react';
import { QuoteForm } from '../components/QuoteForm';

export default {
  title: 'Forms/QuoteForm',
  component: QuoteForm,
  parameters: {
    docs: {
      description: {
        component: 'B2B Quotation Request form supporting multi-carat selection, parcel estimation, company details, delivery location, and real-time validation.',
      },
    },
  },
};

export const StandaloneForm = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <QuoteForm isModal={false} />
    </div>
  ),
};

export const PreFilledWithLabGrownDiamond = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <QuoteForm
        isModal={false}
        initialCategory="Lab-grown"
        initialSpecs="1.50 Ct Round Brilliant D VVS1 Ideal Cut | Cert: CERT-77440695"
      />
    </div>
  ),
};

export const ModalModeForm = {
  render: () => (
    <div className="max-w-2xl mx-auto bg-[#0B131F] border border-slate-800 p-6 rounded-2xl shadow-2xl">
      <QuoteForm
        isModal={true}
        initialCategory="Lab-grown"
        initialSpecs="2.00 Ct Oval Brilliant E VS1 | Surat Direct Export"
      />
    </div>
  ),
};
