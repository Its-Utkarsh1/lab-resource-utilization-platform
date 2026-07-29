import React from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'

const HomePage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Trusted by 50+ Research Institutions
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Manage Lab Resources<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                  Smarter & Faster
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                A full-stack platform for research institutions to share expensive laboratory equipment, 
                optimize utilization rates, and drive data-driven decisions through centralized intelligence.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <Link to="/register" className="btn-primary">
                  Start Free Trial
                </Link>
                <button className="btn-secondary flex items-center gap-2">
                  ▶ Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">✓ No credit card required</span>
                <span className="flex items-center gap-2">✓ Free for students</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs text-slate-400">LabResource Dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-xs text-slate-500">Equipment</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">18</p>
                    <p className="text-xs text-slate-500">In Use</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-2xl font-bold text-amber-600">5</p>
                    <p className="text-xs text-slate-500">Maintenance</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-slate-700">Electron Microscope - In Progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-slate-700">Spectrometer - Pending</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100 animate-bounce">
                <span className="text-sm font-bold text-green-600">98% Uptime</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                <span className="text-sm font-bold text-blue-600">15K+ Bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Institutions" },
            { value: "2,400+", label: "Equipment Managed" },
            { value: "98%", label: "Uptime Rate" },
            { value: "15K+", label: "Monthly Bookings" }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-green-100 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">About Platform</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">What is LabResource?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              LabResource is a <strong>full-stack web application</strong> (React.js + Spring Boot) 
              that allows research institutions, universities, and laboratories to manage equipment inventory, 
              schedule shared resource access, monitor real-time utilization, track maintenance workflows, 
              and analyze resource efficiency through integrated intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🏛️", title: "For Institutions", desc: "Universities and research centers managing hundreds of devices across multiple departments." },
              { icon: "🔬", title: "For Researchers", desc: "Scientists and students who need quick access to shared equipment without delays." },
              { icon: "⚙️", title: "For Technicians", desc: "Lab staff tracking maintenance schedules, calibrations, and equipment health." }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center hover:border-green-200 hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Workflow</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Get started in minutes with our simple 4-step process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up with your institutional email. Choose your role.", color: "green" },
              { step: "02", title: "Browse Equipment", desc: "Search and filter lab equipment with real-time availability.", color: "blue" },
              { step: "03", title: "Book & Schedule", desc: "Reserve equipment with smart calendar and waitlists.", color: "green" },
              { step: "04", title: "Track & Report", desc: "Monitor usage, receive alerts, and generate analytics.", color: "blue" }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border-2 border-slate-100 hover:border-green-300 shadow-sm hover:shadow-xl transition-all text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 ${item.color === 'green' ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Features</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Services We Provide</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive tools for laboratory resource management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Equipment Inventory", desc: "Register, catalog, and track all lab equipment with real-time status monitoring.", icon: "🧪", color: "green", features: ["Real-time status tracking", "QR code integration", "Calibration records"] },
              { title: "Smart Scheduling", desc: "Rule-based booking with calendar views, recurring reservations, and conflict resolution.", icon: "📅", color: "blue", features: ["Calendar integration", "Waitlist management", "Recurring bookings"] },
              { title: "Utilization Monitoring", desc: "Real-time usage tracking with heatmaps, idle alerts, and peak analysis.", icon: "📊", color: "green", features: ["Live dashboards", "Idle detection", "Peak analysis"] },
              { title: "Inter-Institution Sharing", desc: "Share equipment across institutions with cost-sharing and agreements.", icon: "🤝", color: "blue", features: ["Cross-institution discovery", "Cost-sharing calculator", "Agreement templates"] },
              { title: "Maintenance & Calibration", desc: "Preventive maintenance scheduling and certification renewal tracking.", icon: "🔧", color: "green", features: ["PM scheduling", "Technician assignment", "Service logs"] },
              { title: "Analytics & Reporting", desc: "Dashboards and reports for utilization, costs, and procurement recommendations.", icon: "📈", color: "blue", features: ["Custom dashboards", "PDF/Excel export", "Procurement AI"] }
            ].map((service, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">{service.title}</h3>
                <p className="text-sm text-slate-600 mb-5">{service.desc}</p>
                <div className="space-y-2">
                  {service.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className={`w-4 h-4 ${service.color === 'green' ? 'text-green-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div id="roles" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Role-Based Access</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-4">Built for Every Role</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              After logging in, each user sees a personalized dashboard with services tailored to their role.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { role: "Student", icon: "🎓", color: "blue", desc: "Book equipment, view schedules", access: ["Equipment", "Bookings"] },
              { role: "Researcher", icon: "🔬", color: "green", desc: "Advanced booking, sharing", access: ["Equipment", "Bookings", "Sharing"] },
              { role: "Lab Technician", icon: "⚙️", color: "blue", desc: "Maintenance, status updates", access: ["Equipment", "Maintenance"] },
              { role: "Lab Manager", icon: "📋", color: "green", desc: "Approvals, analytics", access: ["All + Analytics"] },
              { role: "Dept Head", icon: "🏛️", color: "blue", desc: "Department analytics", access: ["All + Analytics"] },
              { role: "Admin", icon: "🔒", color: "green", desc: "Full system control", access: ["Full Access"] }
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-6 border-2 text-center hover:shadow-lg transition-all ${item.color === 'green' ? 'border-green-100 hover:border-green-300 bg-green-50/30' : 'border-blue-100 hover:border-blue-300 bg-blue-50/30'}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className={`font-bold text-sm mb-2 ${item.color === 'green' ? 'text-green-700' : 'text-blue-700'}`}>{item.role}</h3>
                <p className="text-xs text-slate-600 mb-3">{item.desc}</p>
                {item.access.map((a, j) => (
                  <div key={j} className={`text-[10px] font-medium px-2 py-1 rounded-full mb-1 ${item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {a}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-green-600 to-blue-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 text-lg mb-10">
            Join thousands of researchers already optimizing their lab resources.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-white text-green-700 font-bold rounded-xl shadow-xl hover:bg-green-50 transition-all">
              Create Free Account
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Log In to Portal
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default HomePage
