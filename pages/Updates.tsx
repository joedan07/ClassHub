import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Megaphone, MessageSquare, AlertTriangle, Bell, Search, Filter, Plus, Edit2 } from 'lucide-react';
import { CreateModal } from '../components/Modals';

const Updates: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  if (!context) return null;
  const { updates, userRole } = context;

  const canPost = userRole !== 'STUDENT';

  const getImportanceStyles = (importance: string) => {
    switch (importance) {
      case 'URGENT': return 'bg-red-50 text-red-600 border-red-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const filteredUpdates = updates.filter((u: any) => {
    const matchesSearch = u.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = sortBy === 'urgent' ? u.importance === 'URGENT' : true;
    return matchesSearch && matchesStatus;
  });

  const sortedAndFiltered = [...filteredUpdates].sort((a: any, b: any) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    
    if (sortBy === 'newest' || sortBy === 'urgent') return timeB - timeA;
    if (sortBy === 'oldest') return timeA - timeB;
    return 0;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 ">

        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Class Feed</h1>
          <p className="text-gray-500">Official announcements and daily updates.</p>
        </div>
        {canPost && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" /> Post Announcement
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search announcements or authors..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative shrink-0">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 w-full bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="urgent">🚨 Urgent Only</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedAndFiltered.length > 0 ? (
          sortedAndFiltered.map((update: any) => (
            <div key={update.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="p-6">
                
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100 shadow-inner">
                      {update.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg">{update.author}</h3>
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest border border-gray-200">
                          {update.authorRole}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">{update.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 uppercase tracking-widest ${getImportanceStyles(update.importance)}`}>
                    {update.importance === 'URGENT' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {update.importance}
                  </div>
                </div>

                <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap pl-[60px]">
                  {update.content}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between pl-[60px]">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm text-gray-400 font-semibold hover:text-indigo-600 transition-colors">
                      <MessageSquare className="w-4 h-4" /> Reply
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-400 font-semibold hover:text-indigo-600 transition-colors">
                      <Bell className="w-4 h-4" /> Remind Me
                    </button>
                  </div>
                  
                  {/* NEW: Edit Pencil Button aligned to the right side of the action bar */}
                  {canPost && (
                    <button 
                      onClick={() => setEditingItem(update)}
                      className="flex items-center gap-2 text-sm text-indigo-400 font-semibold hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No announcements found.</p>
          </div>
        )}
      </div>

      {/* Updated Modal Renderer */}
      {(isModalOpen || editingItem) && (
        <CreateModal 
          type="UPDATE" 
          initialData={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }} 
        />
      )}
    </div>
  );
};

export default Updates;