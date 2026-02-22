import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { GraduationCap, Mail, Lock, Key, Shield, ArrowRight, User, ArrowLeft, Loader2, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [requestedRole, setRequestedRole] = useState('STUDENT');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) return null;
  const { setIsAuthenticated, setUserRole, setPendingRole, setClassCode, setUserName } = context;

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) setError(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;

        if (authData.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
          setClassCode(profile.class_code || '');
          setUserRole(profile.role || 'STUDENT');
          setUserName(profile.full_name || 'Student');
          setPendingRole(profile.pending_role);
          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw authError;

        if (authData.user) {
          const actualRole = 'STUDENT';
          const pRole = requestedRole === 'STUDENT' ? null : requestedRole;
          const cleanCode = code.toUpperCase().trim();

          const { error: updateError } = await supabase.from('profiles').update({
              class_code: cleanCode,
              role: actualRole,
              pending_role: pRole,
              full_name: name
            }).eq('id', authData.user.id);

          if (updateError) throw updateError;

          setClassCode(cleanCode);
          setUserRole(actualRole);
          setUserName(name);
          setPendingRole(pRole);
          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative font-sans">
       <button onClick={() => navigate('/')} className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm z-50">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] mt-16 md:mt-0 z-10">
        
        {/* LEFT PANEL - Premium Branding from Screenshot */}
        <div className="bg-indigo-600 md:w-5/12 p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-inner border border-white/10">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">ClassHub</span>
            </div>
            <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight">Secure <br/>Gateway.</h1>
            <p className="text-indigo-100 text-lg opacity-90 font-medium">Sync your campus life with AI-powered tools and secure workspaces.</p>
          </div>

          {/* Infographic badge from screenshot */}
          <div className="relative z-10 bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-xs font-black text-indigo-50 uppercase tracking-[0.2em] mb-2">Protected Sector</p>
            <p className="text-[11px] text-indigo-100 font-medium leading-relaxed">OAuth 2.0 & Row Level Security active. All data is encrypted at rest.</p>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        </div>

        {/* RIGHT PANEL - Authentic Auth UI */}
        <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p className="text-gray-500 font-medium">{isLogin ? 'Please enter your details to sign in.' : 'Sign up to join your class workspace.'}</p>
          </div>

          {/* GOOGLE SSO - LEGIT VERSION */}
          <button 
            type="button"
            onClick={handleGoogleSignIn} 
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm mb-6 border-b-4 active:border-b-0 active:translate-y-1"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-gray-100" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or continue with email</span>
            <hr className="flex-1 border-gray-100" />
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in shake"><AlertCircle className="w-5 h-5 shrink-0" /><p className="text-sm font-bold">{error}</p></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FULL NAME - ICON RESTORED */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            )}
            
            {/* EMAIL - ICON RESTORED */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input required type="email" placeholder="University Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-indigo-500 transition-all" />
            </div>
            
            {/* PASSWORD - ICON & TOGGLE RESTORED */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-indigo-500 transition-all" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* CLASS JOINING UI - ICONS RESTORED */}
            {!isLogin && (
              <div className="pt-4 border-t border-gray-100 mt-4 space-y-4 animate-in fade-in duration-500">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Join a Workspace</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
                    <input required type="text" placeholder="Class Code (e.g. CSE-SEM4)" value={code} onChange={(e) => setCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-2xl outline-none font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                
                {/* ROLE SELECTION - INFOGRAPHICS/ICONS RESTORED */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Request Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'STUDENT', icon: User, label: 'Student' },
                      { id: 'CR', icon: Shield, label: 'CR' },
                      { id: 'PROFESSOR', icon: GraduationCap, label: 'Faculty' }
                    ].map(role => (
                      <button key={role.id} type="button" onClick={() => setRequestedRole(role.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${requestedRole === role.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'}`}>
                        <role.icon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-indigo-600 font-black hover:underline">{isLogin ? 'Sign up here' : 'Log in here'}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Auth;