import { Link } from 'react-router-dom';
import { Pencil, Users, Clock, Zap, Shield, Cloud } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">EZdraw</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/pricing"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Collaborative Whiteboard
          <br />
          <span className="text-blue-600">Made Simple</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Draw, brainstorm, and collaborate in real-time with your team.
          The next-generation whiteboard platform built for modern teams.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
          >
            Start Drawing Free
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-white text-slate-700 text-lg font-medium rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Collaboration</h3>
            <p className="text-slate-600 leading-relaxed">
              Work together with your team in real-time. See cursors, edits, and changes as they happen.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Version History</h3>
            <p className="text-slate-600 leading-relaxed">
              Never lose your work. Access previous versions and restore them anytime.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Infinite Canvas</h3>
            <p className="text-slate-600 leading-relaxed">
              No boundaries. Draw freely on an infinite canvas with smooth pan and zoom.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">
              Enterprise-grade security with role-based access control and encryption.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cloud Sync</h3>
            <p className="text-slate-600 leading-relaxed">
              Auto-save to the cloud. Access your boards from anywhere, anytime.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <Pencil className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Powerful Tools</h3>
            <p className="text-slate-600 leading-relaxed">
              Shapes, arrows, text, images, and more. Everything you need to bring ideas to life.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams already using EZdraw to collaborate and create amazing work.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Pencil className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">EZdraw</span>
          </div>
          <p className="text-sm">The next-generation collaborative whiteboard platform.</p>
          <p className="text-sm mt-4">© 2025 EZdraw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
