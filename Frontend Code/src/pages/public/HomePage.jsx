import React from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'

// Token reference (kept here since Tailwind arbitrary values are used inline):
// ink    #14181C  — primary dark surface / text
// paper  #F6F5F1  — primary light surface
// steel  #5B6770  — secondary text / borders
// amber  #E8A33D  — primary accent (calibration/warning amber)
// teal   #1F7A6C  — secondary accent (trace/status green)
// line   #D8D3C7  — hairline rule color

const tickerItems = [
  { code: 'EQ-014', name: 'ELECTRON MICROSCOPE', status: 'IN USE', accent: 'amber' },
  { code: 'EQ-022', name: 'MASS SPECTROMETER', status: 'AVAILABLE', accent: 'teal' },
  { code: 'EQ-031', name: 'CENTRIFUGE — HS', status: 'MAINTENANCE', accent: 'amber' },
  { code: 'EQ-045', name: 'NMR SPECTROMETER', status: 'AVAILABLE', accent: 'teal' },
  { code: 'EQ-052', name: 'PCR THERMAL CYCLER', status: 'IN USE', accent: 'amber' },
  { code: 'EQ-063', name: 'X-RAY DIFFRACTOMETER', status: 'AVAILABLE', accent: 'teal' },
]

const audiences = [
  { tag: 'INST', title: 'For Institutions', desc: 'Universities and research centers managing hundreds of devices across multiple departments.' },
  { tag: 'RSCH', title: 'For Researchers', desc: 'Scientists and students who need quick access to shared equipment without delays.' },
  { tag: 'TECH', title: 'For Technicians', desc: 'Lab staff tracking maintenance schedules, calibrations, and equipment health.' },
]

const steps = [
  { n: '01', title: 'Create account', desc: 'Sign up with your institutional email. Choose your role.', accent: 'amber' },
  { n: '02', title: 'Browse equipment', desc: 'Search and filter lab equipment with real-time availability.', accent: 'teal' },
  { n: '03', title: 'Book & schedule', desc: 'Reserve equipment with a smart calendar and waitlists.', accent: 'amber' },
  { n: '04', title: 'Track & report', desc: 'Monitor usage, receive alerts, and generate analytics.', accent: 'teal' },
]

const services = [
  { tag: 'EQ', title: 'Equipment Inventory', desc: 'Register, catalog, and track all lab equipment with real-time status monitoring.', accent: 'amber', features: ['Real-time status tracking', 'QR code integration', 'Calibration records'] },
  { tag: 'SC', title: 'Smart Scheduling', desc: 'Rule-based booking with calendar views, recurring reservations, and conflict resolution.', accent: 'teal', features: ['Calendar integration', 'Waitlist management', 'Recurring bookings'] },
  { tag: 'UM', title: 'Utilization Monitoring', desc: 'Real-time usage tracking with heatmaps, idle alerts, and peak analysis.', accent: 'amber', features: ['Live dashboards', 'Idle detection', 'Peak analysis'] },
  { tag: 'IS', title: 'Inter-Institution Sharing', desc: 'Share equipment across institutions with cost-sharing and agreements.', accent: 'teal', features: ['Cross-institution discovery', 'Cost-sharing calculator', 'Agreement templates'] },
  { tag: 'MC', title: 'Maintenance & Calibration', desc: 'Preventive maintenance scheduling and certification renewal tracking.', accent: 'amber', features: ['PM scheduling', 'Technician assignment', 'Service logs'] },
  { tag: 'AR', title: 'Analytics & Reporting', desc: 'Dashboards and reports for utilization, costs, and procurement recommendations.', accent: 'teal', features: ['Custom dashboards', 'PDF/Excel export', 'Procurement AI'] },
]

const roles = [
  { code: 'STU', role: 'Student', accent: 'teal', desc: 'Book equipment, view schedules', access: ['Equipment', 'Bookings'] },
  { code: 'RES', role: 'Researcher', accent: 'amber', desc: 'Advanced booking, sharing', access: ['Equipment', 'Bookings', 'Sharing'] },
  { code: 'TEC', role: 'Lab Technician', accent: 'teal', desc: 'Maintenance, status updates', access: ['Equipment', 'Maintenance'] },
  { code: 'MGR', role: 'Lab Manager', accent: 'amber', desc: 'Approvals, analytics', access: ['All + Analytics'] },
  { code: 'HOD', role: 'Dept Head', accent: 'teal', desc: 'Department analytics', access: ['All + Analytics'] },
  { code: 'ADM', role: 'Admin', accent: 'amber', desc: 'Full system control', access: ['Full Access'] },
]

const accentText = { amber: 'text-[#E8A33D]', teal: 'text-[#1F7A6C]' }
const accentBg = { amber: 'bg-[#E8A33D]', teal: 'bg-[#1F7A6C]' }
const accentBorder = { amber: 'border-[#E8A33D]', teal: 'border-[#1F7A6C]' }
const accentBgSoft = { amber: 'bg-[#E8A33D]/10', teal: 'bg-[#1F7A6C]/10' }

const HomePage = () => {
  return (
    <PublicLayout>
      <style>{`
        @keyframes lrup-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .lrup-marquee-track {
          animation: lrup-marquee 32s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lrup-marquee-track { animation: none; }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#F6F5F1]">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #D8D3C7 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#1F7A6C]/30 bg-[#1F7A6C]/5 rounded-sm font-mono text-[11px] tracking-widest text-[#1F7A6C] mb-6 uppercase">
                <span className="w-1.5 h-1.5 bg-[#1F7A6C] rounded-full motion-safe:animate-pulse" />
                Trusted by 50+ Research Institutions
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-[#14181C] mb-6 leading-[1.05] tracking-tight">
                Manage Lab Resources
                <br />
                <span className="font-mono font-bold tracking-tight text-[#E8A33D] underline decoration-2 underline-offset-8 decoration-[#E8A33D]/40">
                  Smarter &amp; Faster
                </span>
              </h1>
              <p className="text-lg text-[#5B6770] leading-relaxed mb-8 max-w-lg">
                A full-stack platform for research institutions to share expensive laboratory equipment,
                optimize utilization rates, and drive data-driven decisions through centralized intelligence.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] transition-colors"
                >
                  Start Free Trial
                </Link>
                <button className="px-6 py-3 border border-[#14181C]/20 text-[#14181C] font-mono text-sm tracking-wide uppercase rounded-sm hover:border-[#14181C]/50 transition-colors flex items-center gap-2">
                  <span aria-hidden="true">▶</span> Watch Demo
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-wide text-[#5B6770] uppercase">
                <span className="flex items-center gap-2">
                  <span className="inline-flex w-4 h-4 items-center justify-center border border-[#1F7A6C] text-[#1F7A6C] text-[9px]">✓</span>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-flex w-4 h-4 items-center justify-center border border-[#1F7A6C] text-[#1F7A6C] text-[9px]">✓</span>
                  Free for students
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#14181C] rounded-sm border border-black/40 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#8b95a1] uppercase">
                    LRUP-Console // Live
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#E8A33D] uppercase">
                    <span className="w-1.5 h-1.5 bg-[#E8A33D] rounded-full motion-safe:animate-pulse" />
                    Rec
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="border border-white/10 rounded-sm p-4">
                    <p className="text-2xl font-mono font-bold text-[#E8A33D]">24</p>
                    <p className="text-[10px] font-mono tracking-widest text-[#8b95a1] uppercase mt-1">Equipment</p>
                  </div>
                  <div className="border border-white/10 rounded-sm p-4">
                    <p className="text-2xl font-mono font-bold text-[#1F7A6C]">18</p>
                    <p className="text-[10px] font-mono tracking-widest text-[#8b95a1] uppercase mt-1">In Use</p>
                  </div>
                  <div className="border border-white/10 rounded-sm p-4">
                    <p className="text-2xl font-mono font-bold text-[#8b95a1]">05</p>
                    <p className="text-[10px] font-mono tracking-widest text-[#8b95a1] uppercase mt-1">Maintenance</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-[#e5e7eb] font-mono">
                      <span className="w-1.5 h-1.5 bg-[#E8A33D] rounded-full" />
                      Electron Microscope
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#E8A33D] uppercase">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-[#e5e7eb] font-mono">
                      <span className="w-1.5 h-1.5 bg-[#8b95a1] rounded-full" />
                      Spectrometer
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#8b95a1] uppercase">Pending</span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 bg-[#F6F5F1] rounded-sm shadow-md px-3 py-2 border border-[#14181C]/10 -rotate-2">
                <span className="text-xs font-mono font-bold text-[#1F7A6C] tracking-wide">98% UPTIME</span>
              </div>
              <div className="absolute -bottom-3 -left-3 bg-[#F6F5F1] rounded-sm shadow-md px-3 py-2 border border-[#14181C]/10 rotate-1">
                <span className="text-xs font-mono font-bold text-[#E8A33D] tracking-wide">15K+ BOOKINGS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live status ticker — signature element */}
      <div className="bg-[#14181C] border-y border-black/40 py-3 overflow-hidden" aria-hidden="true">
        <div className="flex whitespace-nowrap lrup-marquee-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 font-mono text-xs tracking-wider uppercase">
              <span className={`w-1.5 h-1.5 rounded-full ${accentBg[item.accent]}`} />
              <span className="text-[#8b95a1]">{item.code}</span>
              <span className="text-[#e5e7eb]">{item.name}</span>
              <span className={accentText[item.accent]}>{item.status}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#D8D3C7]">
          {[
            { value: '50+', label: 'Institutions' },
            { value: '2,400+', label: 'Equipment Managed' },
            { value: '98%', label: 'Uptime Rate' },
            { value: '15K+', label: 'Monthly Bookings' },
          ].map((stat, i) => (
            <div key={i} className="text-center py-8 px-4">
              <p className="text-3xl font-mono font-bold text-[#14181C] mb-1">{stat.value}</p>
              <p className="text-[#5B6770] text-xs font-mono tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#1F7A6C] font-mono font-semibold text-xs tracking-[0.2em] uppercase">About Platform</span>
            <h2 className="text-4xl font-black text-[#14181C] mt-3 mb-6 tracking-tight">What is LabResource?</h2>
            <p className="text-lg text-[#5B6770] leading-relaxed">
              LabResource is a <strong className="text-[#14181C]">full-stack web application</strong> (React.js + Spring Boot)
              that allows research institutions, universities, and laboratories to manage equipment inventory,
              schedule shared resource access, monitor real-time utilization, track maintenance workflows,
              and analyze resource efficiency through integrated intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((item, i) => (
              <div
                key={i}
                className="rounded-sm border border-[#D8D3C7] p-8 hover:border-[#14181C]/30 transition-colors"
              >
                <span className="inline-block font-mono text-[11px] tracking-widest text-[#5B6770] border border-[#D8D3C7] rounded-sm px-2 py-1 mb-4 uppercase">
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold text-[#14181C] mb-3">{item.title}</h3>
                <p className="text-[#5B6770]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 bg-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#1F7A6C] font-mono font-semibold text-xs tracking-[0.2em] uppercase">Workflow</span>
            <h2 className="text-4xl font-black text-[#14181C] mt-3 mb-4 tracking-tight">How It Works</h2>
            <p className="text-[#5B6770] max-w-2xl mx-auto">Get started in minutes with our simple 4-step process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-sm border border-[#D8D3C7] border-t-2 ${accentBorder[item.accent]} p-8`}
              >
                <p className={`font-mono text-3xl font-bold mb-4 ${accentText[item.accent]}`}>{item.n}</p>
                <h3 className="text-lg font-bold text-[#14181C] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5B6770]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#1F7A6C] font-mono font-semibold text-xs tracking-[0.2em] uppercase">Features</span>
            <h2 className="text-4xl font-black text-[#14181C] mt-3 mb-4 tracking-tight">Services We Provide</h2>
            <p className="text-[#5B6770] max-w-2xl mx-auto">Comprehensive tools for laboratory resource management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className={`group bg-white rounded-sm border border-[#D8D3C7] border-l-2 hover:${accentBorder[service.accent]} p-8 transition-colors`}
              >
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-sm font-mono text-xs font-bold mb-4 ${accentBgSoft[service.accent]} ${accentText[service.accent]}`}>
                  {service.tag}
                </span>
                <h3 className="text-lg font-bold text-[#14181C] mb-3">{service.title}</h3>
                <p className="text-sm text-[#5B6770] mb-5">{service.desc}</p>
                <div className="space-y-2">
                  {service.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-[#5B6770] font-mono">
                      <svg className={`w-3.5 h-3.5 ${accentText[service.accent]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div id="roles" className="py-20 bg-[#F6F5F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#1F7A6C] font-mono font-semibold text-xs tracking-[0.2em] uppercase">Role-Based Access</span>
            <h2 className="text-4xl font-black text-[#14181C] mt-3 mb-4 tracking-tight">Built for Every Role</h2>
            <p className="text-[#5B6770] max-w-2xl mx-auto">
              After logging in, each user sees a personalized dashboard with services tailored to their role.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {roles.map((item, i) => (
              <div key={i} className="bg-white rounded-sm border border-[#D8D3C7] p-5 text-center hover:border-[#14181C]/30 transition-colors">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-sm font-mono text-[11px] font-bold mb-3 ${accentBgSoft[item.accent]} ${accentText[item.accent]}`}>
                  {item.code}
                </span>
                <h3 className="font-bold text-sm text-[#14181C] mb-1">{item.role}</h3>
                <p className="text-xs text-[#5B6770] mb-3">{item.desc}</p>
                {item.access.map((a, j) => (
                  <div key={j} className="text-[10px] font-mono tracking-wide text-[#5B6770] border border-[#D8D3C7] rounded-sm px-2 py-1 mb-1 uppercase">
                    {a}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[#14181C] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #F6F5F1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black text-[#F6F5F1] mb-4 tracking-tight">Ready to Get Started?</h2>
          <p className="text-[#8b95a1] text-lg mb-10">
            Join thousands of researchers already optimizing their lab resources.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-[#E8A33D] text-[#14181C] font-mono font-bold text-sm tracking-wide uppercase rounded-sm hover:bg-[#f0b25a] transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-[#F6F5F1]/30 text-[#F6F5F1] font-mono font-bold text-sm tracking-wide uppercase rounded-sm hover:bg-white/5 transition-colors"
            >
              Log In to Portal
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default HomePage