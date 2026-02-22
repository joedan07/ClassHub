import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { Inbox, UserCheck, UserX, ExternalLink, ChevronRight, BookOpen, Clock } from 'lucide-react';

const SubmissionsView: React.FC = () => {
  const context = useContext(AppContext);
  const [myAssignments, setMyAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [rosterSubmissions, setRosterSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!context?.classCode) return;
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch assignments assigned by THIS user (or all if CR)
      let query = supabase.from('assignments').select('*').eq('class_code', context.classCode);
      if (context.userRole === 'PROFESSOR') {
        query = query.eq('assigned_by_id', user?.id);
      }

      const { data } = await query;
      if (data) setMyAssignments(data);
      setLoading(false);
    };
    fetchAssignments();
  }, [context?.classCode]);

  const viewDetails = async (as: any) => {
    setSelectedAssignment(as);
    // Fetch all profiles in class + their submission for this ID
    const { data: students } = await supabase.from('profiles').select('*').eq('class_code', context.classCode).eq('role', 'STUDENT');
    const { data: subs } = await supabase.from('submissions').select('*').eq('assignment_id', as.id);
    
    const combined = students?.map(student => ({
      ...student,
      submission: subs?.find(s => s.student_id === student.id)
    }));
    if (combined) setRosterSubmissions(combined);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Submissions Tracker</h1>
        <p className="text-gray-500 font-medium">Monitor student progress and collect deliverables.</p>
      </div>

      {!selectedAssignment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myAssignments.map(as => (
            <div key={as.id} onClick={() => viewDetails(as)} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{as.title}</h3>
              <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">{as.subject}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(as.deadline_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setSelectedAssignment(null)} className="text-sm font-black text-indigo-600 flex items-center gap-2 mb-4 hover:translate-x-1 transition-transform">
             ← Back to All Assignments
          </button>
          
          <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl mb-8">
            <h2 className="text-2xl font-black mb-2">{selectedAssignment.title}</h2>
            <p className="text-gray-400 font-medium uppercase text-xs tracking-[0.2em]">{selectedAssignment.subject} • Submission Roster</p>
          </div>

          <div className="grid gap-3">
            {rosterSubmissions.map(student => (
              <div key={student.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${student.full_name}&backgroundColor=e0e7ff`} className="w-10 h-10 rounded-full bg-gray-100" />
                  <div>
                    <p className="font-bold text-gray-900">{student.full_name}</p>
                    <p className="text-xs text-gray-400">{student.email}</p>
                  </div>
                </div>
                
                {student.submission ? (
                  <div className="flex items-center gap-4">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Turned In
                    </span>
                    <a href={student.submission.file_url} target="_blank" rel="noreferrer" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-1">
                    <UserX className="w-3 h-3" /> Missing
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsView;