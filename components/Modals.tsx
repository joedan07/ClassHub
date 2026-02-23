import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { supabase } from '../supabase';
import { X, Send, UploadCloud, Tag, Bookmark, FileText, Save, Loader2, UserCheck, Link as LinkIcon, Upload } from 'lucide-react';

interface CreateModalProps {
  onClose: () => void;
  type: 'ASSIGNMENT' | 'NOTE' | 'UPDATE';
  initialData?: any;
}

// --- 1. THE SUBMISSION MODAL (For Students to upload work) ---
export const SubmissionModal: React.FC<{ assignment: any, onClose: () => void }> = ({ assignment, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const context = useContext(AppContext);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !context) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      const fileExt = file.name.split('.').pop();
      const filePath = `${context.classCode}/${user.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('assignments').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('submissions').insert({
        assignment_id: assignment.id,
        student_id: user.id,
        file_url: publicUrl,
        file_name: file.name,
        class_code: context.classCode
      });

      if (dbError) throw dbError;

      alert("Assignment submitted successfully!");
      context.refreshData(); 
      onClose();
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">Submit Work</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
        </div>
        <p className="text-gray-500 mb-6 font-medium">Uploading for: <span className="text-indigo-600 font-bold">{assignment.title}</span></p>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-indigo-100 rounded-2xl p-10 text-center hover:bg-indigo-50/50 transition-all relative group">
            <input type="file" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <Upload className="w-12 h-12 text-indigo-300 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-bold text-indigo-900">{file ? file.name : "Select your PDF or Document"}</p>
            <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : "Confirm & Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 2. THE CREATE MODAL ---
export const CreateModal: React.FC<CreateModalProps> = ({ onClose, type, initialData }) => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null); // For Notes Upload
  
  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [facultyId, setFacultyId] = useState('CR'); // Default to CR
  const [tags, setTags] = useState('');

  useEffect(() => {
    // Fetch all Professors in THIS class code for the dropdown
    const fetchFaculty = async () => {
      if (!context?.classCode) return;
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('class_code', context.classCode)
        .in('role', ['PROFESSOR', 'CR']);
      if (data) setFacultyList(data);
    };
    fetchFaculty();

    if (initialData) {
      setTitle(initialData.title || '');
      setSubject(initialData.subject || '');
      setDeadline(initialData.deadline_date || '');
      setDescription(initialData.description || initialData.content || '');
      setSubmissionLink(initialData.submission_link || '');
      setFacultyId(initialData.assigned_by_id || 'CR');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
    }
  }, [initialData, context?.classCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context?.classCode) return;
    setLoading(true);

    try {
      let finalUrl = initialData?.file_url || null;

      // Logic: Handle File Upload specifically for Notes
      if (type === 'NOTE' && file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${context.classCode}/notes/${Math.random()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('notes').upload(filePath, file);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(filePath);
        finalUrl = publicUrl;
      }

      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload: any = {
        class_code: context.classCode,
        title,
        subject,
        description,
        tags: tagArray,
      };

      if (type === 'ASSIGNMENT') {
        payload.deadline_date = deadline;
        payload.submission_link = submissionLink;
        payload.assigned_by_id = facultyId === 'CR' ? null : facultyId;
        payload.professor = facultyId === 'CR' ? 'Class Representative' : facultyList.find(f => f.id === facultyId)?.full_name || 'Staff';
        
        if (initialData) await supabase.from('assignments').update(payload).eq('id', initialData.id);
        else await supabase.from('assignments').insert([payload]);
      } 
      else if (type === 'NOTE') {
        payload.file_url = finalUrl; // Attach the uploaded file URL
        if (initialData) await supabase.from('notes').update(payload).eq('id', initialData.id);
        else await supabase.from('notes').insert([payload]);
      }
      else if (type === 'UPDATE') {
        const updatePayload = {
          class_code: context.classCode,
          content: description,
          importance: tagArray.some(t => t.toLowerCase() === 'urgent') ? 'URGENT' : 'MEDIUM',
          author: context.userName,
          author_role: context.userRole
        };
        if (initialData) await supabase.from('updates').update(updatePayload).eq('id', initialData.id);
        else await supabase.from('updates').insert([updatePayload]);
      }

      context.refreshData();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="px-8 py-6 border-b flex justify-between items-center bg-indigo-50/50">
          <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tight">
            {initialData ? 'Update' : 'Create'} {type}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all shadow-sm"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Primary Title</label>
              <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* RESTORED: Original Assignment Grid (Subject & Due Date) */}
            {type === 'ASSIGNMENT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                  <input required placeholder="e.g. AI & ML" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Due Date</label>
                  <input type="date" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
              </div>
            )}

            {/* RESTORED: Original Assigned By & Submission Link fields */}
            {type === 'ASSIGNMENT' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Assigned By (Class Faculty)</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
                    <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none font-bold appearance-none">
                      <option value="CR">Internal (Class Representative)</option>
                      {facultyList.filter(f => f.role === 'PROFESSOR').map(f => (
                        <option key={f.id} value={f.id}>{f.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Submission Link (Optional)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="url" placeholder="https://forms.gle/..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium" value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* NEW: Notes File Upload Box (Only shows for Notes) */}
            {type === 'NOTE' && (
               <div className="border-2 border-dashed border-indigo-100 rounded-2xl p-6 text-center hover:bg-indigo-50/30 transition-all relative mt-2">
                 <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                 <UploadCloud className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
                 <p className="text-sm font-bold text-gray-600">{file ? file.name : "Attach Material (PDF/DOC)"}</p>
               </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Content Details</label>
              <textarea required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium h-32 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : initialData ? <Save className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              {initialData ? 'Commit Changes' : `Publish ${type}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};