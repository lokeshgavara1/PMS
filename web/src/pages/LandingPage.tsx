import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChartIcon, ChartIcon, LightningIcon, UsersIcon, ClockIcon, ShieldIcon } from '../components/SidebarIcons';
import centurionLogo from '../assets/cutm-logo.png';
import teamIllustration from '../assets/landing_page_img.jpg';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: BarChartIcon, title: 'Smart Task Management', description: 'Organize projects with intelligent task tracking and dependencies' },
    { icon: ChartIcon, title: 'Real-Time Analytics', description: 'Get instant insights into project progress and team performance' },
    { icon: LightningIcon, title: 'Automated Workflows', description: 'Streamline repetitive tasks with intelligent automation' },
    { icon: UsersIcon, title: 'Team Collaboration', description: 'Keep your team aligned with real-time updates and comments' },
    { icon: ClockIcon, title: 'Time Tracking', description: 'Log hours and monitor resource allocation efficiently' },
    { icon: ShieldIcon, title: 'Secure & Compliant', description: 'Enterprise-grade security with role-based access control' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={centurionLogo} alt="Centurion University" className="h-12 w-auto" />
            <span className="text-lg font-bold text-gray-900">CUTM-PMS</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-sky-blue-50 via-white to-beige-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage Projects
                <span className="text-teal-500"> Smarter</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                CUTM-PMS empowers teams to plan, execute, and deliver projects with confidence.
                Get intelligent task tracking, real-time analytics, and seamless collaboration in one platform.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold text-lg"
                >
                  Get Started →
                </button>
                <button
                  onClick={handleLearnMore}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-semibold text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src={teamIllustration} alt="Team collaboration" className="w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-teal-500 mb-2">500+</p>
              <p className="text-gray-600">Projects Managed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-500 mb-2">99%</p>
              <p className="text-gray-600">Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-500 mb-2">4.9★</p>
              <p className="text-gray-600">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage projects efficiently and keep your team aligned
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="mb-4 text-teal-500">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-teal-500 to-navy-500 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Enterprise Security</h2>
            <p className="text-lg text-sky-blue-100 mb-6">
              🔐 Your data is protected with enterprise-grade security and compliance standards
            </p>
            <p className="text-sky-blue-100 text-sm">
              Restricted Access: Login is limited to official cutm.ac.in / cutmap.ac.in accounts
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Project Management?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of teams already using CUTM-PMS to deliver projects on time and on budget
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold text-lg"
          >
            Sign In Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/centurion-logo.png" alt="Centurion University" className="h-10 w-auto rounded-full" />
                <span className="text-white font-bold">CUTM-PMS</span>
              </div>
              <p className="text-sm">Project Management System for Centurion University</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 Centurion University of Technology and Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
