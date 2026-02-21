import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { Key, Shield, User, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const context = useContext(AppContext);
  const [code, setCode] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);

  if (!context) return null;

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Use name from Google metadata if available, otherwise fallback
    const googleName = user.user_metadata.full_name || user.user_metadata.name;

    const { error } = await supabase
      .from('profiles')
      .update({
        class_code: code.toUpperCase().trim(),
        role: 'STUDENT', // Default to student
        pending_role: role === 'STUDENT' ? null : role, // Request CR/Professor
        full_name: googleName || context.userName
      })
      .eq('id', user.id);

    if (!error) {
      context.setClassCode(code.toUpperCase().trim());
      context.setUserName(googleName || context.userName);
      context.setUserRole('STUDENT');
      context.setPendingRole(role === 'STUDENT' ? null : role);
      // Data is synced, the app will now show the dashboard
    } else {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">One last thing...</h2>
          <p className="text-gray-500 font-medium mt-2">Finish setting up your profile to enter ClassHub.</p>
        </div>

        <form onSubmit={handleCompleteProfile} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Your Workspace Code</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
              <input 
                required 
                placeholder="e.g. WOX-CSE-2026" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Request Account Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'STUDENT', icon: User, label: 'Student' },
                { id: 'CR', icon: Shield, label: 'CR' },
                { id: 'PROFESSOR', icon: GraduationCap, label: 'Faculty' }
              ].map(item => (
                <button 
                  key={item.id} 
                  type="button" 
                  onClick={() => setRole(item.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === item.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:bg-indigo-50'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={loading || !code} 
            type="submit" 
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Enter Dashboard <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};