import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { FolderOpen, FileText, Download, Clock, ExternalLink, Search } from 'lucide-react';

const MyFiles: React.FC = () => {
  const context = useContext(AppContext);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMyFiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subData, error: subError } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', user.id);

      if (subError) {
        setLoading(false);
        return;
      }

      // Manual mapping to assignment titles to avoid complex joins
      const { data: asData } = await supabase.from('assignments').select('id, title');
      const enriched = (subData || []).map(sub => ({
        ...sub,
        assignment_title: asData?.find(a => a.id === sub.assignment_id)?.title || 'Submission'
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setSubmissions(enriched);
      setLoading(false);
    };
    fetchMyFiles();
  }, []);

  const filtered = submissions.filter(s => 
    s.file_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.assignment_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Submissions</h1>
        <p className="text-gray-500 font-medium italic">Your permanent cloud archive.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search your archive..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none shadow-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-3xl" />)
        ) : filtered.length > 0 ? (
          filtered.map((sub) => (
            <div key={sub.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-500 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><FileText /></div>
                <div>
                  <h3 className="font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">{sub.file_name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <span>{sub.assignment_title}</span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-gray-400"><Clock className="w-3 h-3" /> {new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={sub.file_url} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors"><ExternalLink className="w-5 h-5" /></a>
                <a href={sub.file_url} download className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"><Download className="w-5 h-5" /></a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed">
            <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest">No files found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFiles;