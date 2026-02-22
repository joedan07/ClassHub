import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Bell, Calendar, Shield, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">ClassHub</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/auth')} className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Sign In
            </button>
            <button onClick={() => navigate('/auth')} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Zap className="w-3.5 h-3.5" /> Built for Modern Universities
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Your entire degree, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">synchronized.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Stop losing PDFs in crowded WhatsApp groups. ClassHub is the ultimate command center for tracking assignments, downloading study materials, and managing your syllabus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group">
              Join Your Class <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-white border-t border-gray-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Everything you need to secure that A.</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Designed by students, for students. We built the tools that your university portal is missing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Smart Deadlines', desc: 'Never miss a submission. We automatically track your pending tasks and organize them by nearest deadline.' },
              { icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', title: 'The Study Vault', desc: 'A globally searchable repository for all your class notes, previous year papers, and textbook PDFs.' },
              { icon: Bell, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Urgent Announcements', desc: 'A dedicated class feed where Professors and CRs can post critical updates without the noise of a group chat.' }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feat.bg} ${feat.color}`}>
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Shield className="w-5 h-5" />
            <span className="font-bold tracking-widest uppercase text-sm">ClassHub Security</span>
          </div>
          <p className="text-gray-500 text-sm font-medium text-center md:text-left">
            © 2026 ClassHub Inc. Built for the modern campus.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;