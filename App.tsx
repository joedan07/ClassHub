import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from './supabase';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Notes from './pages/Notes';
import Updates from './pages/Updates';
import Syllabus from './pages/Syllabus';
import Admin from './pages/Admin';
import Sidebar from './components/Sidebar';
import { Onboarding } from './components/Onboarding';
import MyFiles from './pages/MyFiles';
import SubmissionsView from './pages/SubmissionsView';

export const AppContext = createContext<any>(null);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('STUDENT');
  const [userName, setUserName] = useState('');
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(true);

  const [assignments, setAssignments] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          setIsAuthenticated(true);
          setUserRole(profile.role);
          setUserName(profile.full_name || 'Student');
          setPendingRole(profile.pending_role);
          setClassCode(profile.class_code);
          if (profile.class_code) fetchClassData(profile.class_code);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const fetchClassData = async (code: string) => {
    if (!code) return;
    const [asData, ntData, upData] = await Promise.all([
      supabase.from('assignments').select('*').eq('class_code', code).order('created_at', { ascending: false }),
      supabase.from('notes').select('*').eq('class_code', code).order('created_at', { ascending: false }),
      supabase.from('updates').select('*').eq('class_code', code).order('created_at', { ascending: false })
    ]);
    if (asData.data) setAssignments(asData.data);
    if (ntData.data) setNotes(ntData.data);
    if (upData.data) setUpdates(upData.data);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      userRole, setUserRole,
      userName, setUserName,
      pendingRole, setPendingRole,
      classCode, setClassCode,
      assignments, setAssignments, notes, setNotes, updates, setUpdates,
      refreshData: () => fetchClassData(classCode)
    }}>
      <Router>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" />} />
          <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />} />

          <Route path="/*" element={
            isAuthenticated ? (
              !classCode ? (
                <Onboarding />
              ) : (
                <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
                  <Sidebar />
                  <div className="flex-1 flex flex-col min-w-0">
                    {pendingRole && (
                      <div className="bg-amber-400 text-amber-900 px-4 py-3 text-sm font-bold flex items-center justify-center gap-3 shadow-md z-50 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                        Privilege request for '{pendingRole}' is pending approval.
                      </div>
                    )}
                    <div className="flex-1 overflow-y-auto">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/assignments" element={<Assignments />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route path="/updates" element={<Updates />} />
                        <Route path="/syllabus" element={<Syllabus />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/my-files" element={<MyFiles />} />
                        <Route path="/submissions" element={<SubmissionsView />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <Navigate to="/auth" />
            )
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}