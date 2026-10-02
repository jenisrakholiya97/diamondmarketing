import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Sliders, ArrowRight, Plus, Trash2, CheckCircle2, Layers } from 'lucide-react';

export const SupplyPage = () => {
  const { openQuoteModal, SUPPLY_CAPABILITIES } = useShop();

  const [selectedShape, setSelectedShape] = useState('Round Brilliant');
  const [selectedCarat, setSelectedCarat] = useState('1.00ct - 1.49ct');
  const [selectedCategory, setSelectedCategory] = useState('Lab-grown');
  const [selectedColor, setSelectedColor] = useState('D');
  const [selectedClarity, setSelectedClarity] = useState('VS1');

  const [specificationsList, setSpecificationsList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const shapesList = [
    'Round Brilliant',
    'Oval',
    'Emerald',
    'Radiant',
    'Princess',
    'Pear',
    'Marquise',
    'Cushion',
    'Asscher',
  ];

  const caratRanges = [
    '0.30ct - 0.69ct',
    '0.70ct - 0.99ct',
    '1.00ct - 1.49ct',
    '1.50ct - 1.99ct',
    '2.00ct - 2.99ct',
    '3.00ct - 5.00ct+',
  ];

  const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'Fancy'];
  const clarityOptions = ['FL/IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'];

  const handleAddSpecification = () => {
    const newSpec = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      category: selectedCategory,
      shape: selectedShape,
      carat: selectedCarat,
      color: selectedColor,
      clarity: selectedClarity,
      certStandard: 'IGI & GCAL 8X Standard',
    };

    setSpecificationsList((prev) => [...prev, newSpec]);
    setToastMessage('Specification added to quote request.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRemoveSpecification = (id) => {
    setSpecificationsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSpecifications = () => {
    setSpecificationsList([]);
  };

  const handleRequestSingleSpecQuote = () => {
    openQuoteModal({
      category: selectedCategory,
      specs: `Required Loose Stone Specs:\nCategory: ${selectedCategory}\nShape: ${selectedShape}\nCarat Range: ${selectedCarat}\nColor: ${selectedColor}\nClarity: ${selectedClarity}\nCert: IGI & GCAL 8X Standard`,
    });
  };

  const handleRequestAllSpecsQuote = () => {
    if (specificationsList.length === 0) return;

    const specsText = specificationsList
      .map(
        (item, idx) =>
          `${idx + 1}. [${item.category}] ${item.shape} • ${item.carat} • Color: ${item.color} • Clarity: ${item.clarity} • Cert: ${item.certStandard}`
      )
      .join('\n');

    openQuoteModal({
      category: specificationsList[0]?.category || selectedCategory,
      specs: `Required Loose Stone Specifications List (${specificationsList.length} items):\n\n${specsText}`,
    });
  };

  return (
    <div className="space-y-12 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          Supply
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
          Loose Diamond Supply
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
          Direct sourcing for lab-grown and custom studio requirements across the trade market.
        </p>
      </div>

      {/* Specification Matrix Section */}
      <section className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={20} className="text-emerald-600 dark:text-emerald-400" />
              <span>Specification Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Match your sourcing preferences and prepare a quote request.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('Lab-grown')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${selectedCategory === 'Lab-grown'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-800'
                }`}
            >
              Lab-Grown
            </button>
          </div>
        </div>

        {/* Shapes Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Diamond Shape
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {shapesList.map((shape) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`py-2 px-2 rounded-lg text-xs font-mono text-center border transition cursor-pointer truncate ${selectedShape === shape
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                title={shape}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Carat Ranges Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Carat Range
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {caratRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedCarat(range)}
                className={`py-2 px-3 rounded-lg text-xs font-mono text-center border transition cursor-pointer ${selectedCarat === range
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Color Grade Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`py-2 px-2 rounded-lg text-xs font-mono text-center border transition cursor-pointer ${selectedColor === color
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Clarity Grade Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Clarity
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {clarityOptions.map((clarity) => (
                <button
                  key={clarity}
                  onClick={() => setSelectedClarity(clarity)}
                  className={`py-2 px-2 rounded-lg text-xs font-mono text-center border transition cursor-pointer ${selectedClarity === clarity
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                >
                  {clarity}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Summary & Action Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300 w-full lg:w-auto flex-1 min-w-0">
            <span className="text-slate-500 uppercase tracking-widest block text-[10px]">
              Active specification
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white break-words">
              {selectedCategory} Loose Diamond • {selectedShape} • {selectedCarat}
            </div>
            <div className="text-slate-600 dark:text-slate-400 break-words">
              Cert Standard: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">IGI / GCAL 8X</span> • Color: <span className="text-slate-900 dark:text-white font-semibold">{selectedColor}</span> • Clarity: <span className="text-slate-900 dark:text-white font-semibold">{selectedClarity}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleAddSpecification}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900/80 dark:text-emerald-300 dark:border-emerald-800 font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>Add to list</span>
            </button>

            <button
              onClick={handleRequestSingleSpecQuote}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition cursor-pointer"
            >
              <span>Request Quote</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-fade-in font-semibold">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </section>

      {/* Configured Specifications List Section */}
      <section className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Configured Specs</span>
                <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {specificationsList.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Build a single or multi-stone sourcing list.</p>
            </div>
          </div>

          {specificationsList.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAllSpecifications}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs text-slate-700 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition cursor-pointer font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {specificationsList.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/40">
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
              No specifications yet. Add one to build a quote request.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {specificationsList.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-sm"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 shrink-0">
                    #{idx + 1}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${item.category === 'Lab-grown'
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                          }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.shape}</span>
                      <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        {item.carat}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                      Color: <span className="text-slate-900 dark:text-slate-200 font-semibold">{item.color}</span> • Clarity: <span className="text-slate-900 dark:text-slate-200 font-semibold">{item.clarity}</span> • Standard Cert: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.certStandard}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveSpecification(item.id)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 dark:border-rose-900/60 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 self-end sm:self-center"
                  title="Remove"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            ))}

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleRequestAllSpecsQuote}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition cursor-pointer"
              >
                <span>Request all specs ({specificationsList.length})</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Existing Information Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
              Core Offering
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {SUPPLY_CAPABILITIES.labGrown.title}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-mono text-slate-500 dark:text-slate-400 block uppercase">Certification Standard</span>
              <p className="text-slate-700 dark:text-slate-200 mt-0.5">
                {SUPPLY_CAPABILITIES.labGrown.certStandard}
              </p>
            </div>
            <div>
              <span className="font-mono text-slate-500 dark:text-slate-400 block uppercase">Physical Trade Samples</span>
              <p className="text-slate-700 dark:text-slate-200 mt-0.5">
                {SUPPLY_CAPABILITIES.labGrown.sampling}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700">
              Custom Studio
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {SUPPLY_CAPABILITIES.customStudio.title}
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-mono text-slate-500 dark:text-slate-400 block uppercase">Certification Standard</span>
              <p className="text-slate-700 dark:text-slate-200 mt-0.5">
                {SUPPLY_CAPABILITIES.customStudio.certStandard}
              </p>
            </div>
            <div>
              <span className="font-mono text-slate-500 dark:text-slate-400 block uppercase">Documentation & Verification</span>
              <p className="text-slate-700 dark:text-slate-200 mt-0.5">
                {SUPPLY_CAPABILITIES.customStudio.documentation}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
