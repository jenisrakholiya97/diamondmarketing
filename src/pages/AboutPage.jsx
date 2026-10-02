import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Building2, ShieldCheck, CheckCircle2, Award, 
  ArrowRight, Sparkles, FileText, Lock, 
  Video, Eye, Truck, Flame, History
} from 'lucide-react';

export const AboutPage = () => {
  const { navigate, openQuoteModal } = useShop();
  const [activeStepTab, setActiveStepTab] = useState(0);

  const historyTimeline = [
    {
      year: '2014',
      title: 'Established in Surat, Gujarat',
      subtitle: 'The Global Diamond Capital',
      desc: 'Founded as a primary gemological inspection and diamond polishing evaluation desk in Surat, India — the manufacturing hub responsible for cutting and polishing over 90% of the world’s loose diamonds.',
      badge: 'Surat Office'
    },
    {
      year: '2018',
      title: 'CVD & HPHT Lab-Growth Direct Pipeline',
      subtitle: 'Pioneering Modern Diamond Tech',
      desc: 'Recognizing the rise of lab-grown diamonds, we established direct partnerships with premier CVD/HPHT growers in Gujarat, establishing direct factory supply lines without multi-tier broker markups.',
      badge: 'Direct Sourcing'
    },
    {
      year: '2021',
      title: '360° HD Macro Studio & Cert Verification',
      subtitle: 'Uncompromising Transparency',
      desc: 'Built an in-house daylight-calibrated 360° HD macro photography studio in Surat. Every stone is filmed and verified against its official IGI or GCAL certificate prior to client dispatch.',
      badge: '100% Media Match'
    },
    {
      year: 'Present',
      title: 'Global Direct Trade Partner',
      subtitle: 'Serving 480+ Independent Studios',
      desc: 'Supplying verified bench jewelers, custom engagement ateliers, and retail jewelry designers across the United States, United Kingdom, Canada, and Australia with 7-day insured delivery.',
      badge: 'Global Sourcing Desk'
    }
  ];

  const workingProcessSteps = [
    {
      id: '01',
      icon: Eye,
      title: '1. Primary Selection at Surat Source',
      tagline: 'Raw & Crystal Inspection',
      detail: 'Our Surat team personally evaluates lab-grown CVD/HPHT growth batches and high-purity polished lab diamond lots. We filter out stones with brown or milky hues, internal strain lines, or optical cloudiness. Only eye-clean, highly luminous stones move forward to cert verification.'
    },
    {
      id: '02',
      icon: Award,
      title: '2. Dual Loupe & Cert Verification',
      tagline: '30x Magnification Audit',
      detail: 'Each loose stone undergoes a physical 30x loupe inspection by our IGI and GCAL trained gemologists. We cross-reference the girdle laser inscription, table/depth percentages, crown angles, and pavilion symmetry against official lab reports.'
    },
    {
      id: '03',
      icon: Video,
      title: '3. 360° HD Macro Studio Filming',
      tagline: 'Daylight Calibrated Video',
      detail: 'Before asking for final balance payment, we film the exact loose stone in 360° high-definition macro video using daylight-calibrated LED boxes. You see the true fire, scintillation, and stone inclusions as if holding it under your own loupe.'
    },
    {
      id: '04',
      icon: Truck,
      title: '4. Sealed Vault Packaging & Transit',
      tagline: '7-Day Door-to-Door SLA',
      detail: 'Once you approve the HD video, your stone is sealed in tamper-evident gem vaults and dispatched via insured courier (FedEx / Malca-Amit). Shipments arrive at your studio bench in ~7 business days fully insured.'
    }
  ];

  const teamMembers = [
    {
      name: 'Aarav Shah',
      role: 'Founder & Managing Director',
      location: 'Surat, India',
      bio: 'Over a decade of direct diamond manufacturing and trade execution experience in Surat. Dedicated to empowering independent jewelers with direct factory pricing.',
      experience: '12+ Yrs Trade'
    },
    {
      name: 'Rupesh Patel',
      role: 'Chief Gemologist (IGI & GCAL Certified)',
      location: 'Surat Desk',
      bio: 'Specializes in CVD/HPHT optical purity analysis, 3X EX cut evaluation, and IGI/GCAL certificate verification for loose stones.',
      experience: '16+ Yrs Gemology'
    },
    {
      name: 'Priya Sharma',
      role: '360° HD Studio & Media Lead',
      location: 'Surat Studio',
      bio: 'Manages macro photography and 360° gemstone video capture, ensuring color-accurate lighting and complete transparency for international clients.',
      experience: '8+ Yrs Media'
    },
    {
      name: 'David Sterling',
      role: 'International Trade & Logistics Lead',
      location: 'North America Desk',
      bio: 'Oversees door-to-door courier logistics, customs clearance, and client relations for studio accounts in the US, UK, Canada, and Australia.',
      experience: '10+ Yrs Logistics'
    }
  ];

  return (
    <div className="space-y-16 py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
      
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-[#0F172A] dark:to-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 md:p-14 shadow-xl dark:shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-xs font-mono text-emerald-700 dark:text-emerald-300">
            <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>NIVVAN JEWELS / GIGAKELVIN SURAT DESK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-sans leading-tight">
            Our Story: From Surat Cutting Desk to Global Trade Partner
          </h1>

          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            Gigakelvin Diamonds operates directly from Surat, Gujarat — the world's premier diamond cutting, polishing, and lab-grown synthesis center. We connect independent bench jewelers, custom ateliers, and goldsmiths directly to the source, bypassing multi-tiered middleman markups.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => openQuoteModal()}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer"
            >
              <span>Request Direct USD Specs</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore Loose Diamond Inventory</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Metric Facts Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-1 shadow-sm">
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">12+ Yrs</span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block">Surat Desk Experience</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Est. 2014 in Surat, India</span>
        </div>
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-1 shadow-sm">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">14,500+</span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block">Stones Inspected</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">IGI & GCAL Verified</span>
        </div>
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-1 shadow-sm">
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">480+</span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block">Verified Trade Studios</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">US, UK, CA, AU Accounts</span>
        </div>
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-1 shadow-sm">
          <span className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 font-mono">4.9 / 5.0</span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block">Verified Trade Rating</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">99.4% On-Time SLA</span>
        </div>
      </section>

      {/* Company Inception & History Story */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
            <History size={14} />
            <span>Company History & Evolution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            How We Started & Why We Exist
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-3xl mt-1 leading-relaxed">
            The full journey of NIVVAN JEWELS & Gigakelvin Diamonds — from a local diamond evaluation desk in Surat to an international direct trade pipeline for independent bench jewelers.
          </p>
        </div>

        {/* Story Narrative Box */}
        <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              Over <strong>90% of all loose diamonds on Earth</strong> are cut, polished, and certified in Surat, Gujarat. For decades, traditional diamond supply chains meant that a loose diamond produced in a Surat cutting facility passed through 3 to 5 intermediary brokers, regional import firms, and wholesale markups before finally reaching an independent jeweler’s workbench in New York, London, Sydney, or Toronto.
            </p>
            <p>
              In <strong>2014</strong>, NIVVAN JEWELS established its primary gemological inspection and grading desk in Surat. Our founding team — composed of experienced master diamond polishers and certified gemologists — worked directly within Surat’s core diamond district. We witnessed firsthand how independent bench jewelers were paying premium retail-adjacent prices for loose stones simply because they lacked direct access to Surat factory pricing.
            </p>
            <p>
              With the emergence of high-quality <strong>CVD (Chemical Vapor Deposition) and HPHT (High Pressure High Temperature)</strong> lab-grown diamond synthesis in Gujarat, we saw a transformative opportunity. In 2018, we built direct supply partnerships with premier lab growers and precision cutting units across Gujarat, creating a streamlined B2B portal tailored exclusively for independent jewelry business owners.
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            {historyTimeline.map((item) => (
              <div
                key={item.year}
                className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 relative hover:border-emerald-500/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">{item.subtitle}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work: Detailed Operational Narrative */}
      <section className="space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
            <Flame size={14} />
            <span>Our Sourcing Methodology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            How We Work: Step-by-Step Surat Operations Story
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-3xl mt-1 leading-relaxed">
            Every stone that leaves our Surat desk follows a rigorous quality assurance protocol designed to ensure complete commercial peace of mind.
          </p>
        </div>

        {/* Process Step Tabs & Cards */}
        <div className="space-y-6">
          {/* Step Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {workingProcessSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStepTab === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepTab(idx)}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-slate-900 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-md'
                      : 'bg-white dark:bg-[#0B131F] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      STEP {step.id}
                    </span>
                    <Icon size={18} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {step.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Step Display Box */}
          <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-bold text-lg">
                {workingProcessSteps[activeStepTab].id}
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-semibold block">
                  {workingProcessSteps[activeStepTab].tagline}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {workingProcessSteps[activeStepTab].title}
                </h3>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-4">
              {workingProcessSteps[activeStepTab].detail}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold block">Primary Standard</span>
                <span className="text-slate-700 dark:text-slate-300">IGI & GCAL Certified Stones</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold block">Media Inspection</span>
                <span className="text-slate-700 dark:text-slate-300">360° Daylight HD Video Scan</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold block">Insured Transit</span>
                <span className="text-slate-700 dark:text-slate-300">~7-Day Global Door-to-Door</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles & Institutional Safeguards */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Trade-Only Guarantees
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Our Core Operating Commitments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Strict Trade-Only Policy</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We exclusively supply trade accounts: independent bench jewelers, custom designers, and retail studios. We never sell finished jewelry or mountings, and we never compete with our clients.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Video size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">HD Media Sign-off Guarantee</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              You receive an unedited 360° macro video and high-resolution cert scan of the exact stone matching the certificate serial number before paying the final 50% balance.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Truck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Insured Door-to-Door Delivery</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Shipments to the US, UK, Canada, and Australia are fully insured through specialist high-value couriers, arriving at your bench in approximately 7 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Surat Sourcing Desk Team */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Surat Operations & Leadership Desk
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Meet the Gemologists & Sourcing Specialists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white dark:bg-[#0B131F] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm hover:border-emerald-500/40 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded shrink-0">
                  {member.experience}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{member.location}</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">{member.name}</h3>
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-mono font-medium leading-relaxed">{member.role}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-3">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="bg-gradient-to-r from-emerald-500/10 via-slate-50 to-white dark:from-emerald-950/60 dark:via-[#0B131F] dark:to-[#0B131F] border border-emerald-500/30 dark:border-emerald-900/60 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Ready to Source Direct from Surat?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Submit your diamond specifications today for immediate USD trade pricing, IGI/GCAL certificate verification, and 360° HD macro video previews.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openQuoteModal()}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
          >
            <span>Request Trade Quote</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
};
