import React, { useState } from 'react';
import { Shield, Search, Camera, Check, Clock, Filter } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { COMPLAINT_CATEGORIES, STATUS_TYPES, URGENCY_LEVELS } from '../utils/dummyData';

const AdminDashboard = () => {
  const { complaints, updateStatus, resetData } = useComplaints();
  const [filter, setFilter] = useState('all');
  const [activeComplaint, setActiveComplaint] = useState(null);
  
  // For simulating image upload
  const handleImageCapture = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStatus(id, 'resolved', reader.result);
        setActiveComplaint(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="p-4 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-800 text-white rounded-lg">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">Admin Portal</h2>
            <p className="text-xs text-slate-500 font-medium">Manage Village Issues</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all data back to the default samples? This will remove any newly reported issues.")) {
              resetData();
            }
          }}
          className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold rounded-lg transition-colors border border-red-200"
        >
          Reset Data
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button 
          onClick={() => setFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Issues
        </button>
        {Object.entries(STATUS_TYPES).map(([key, value]) => (
          <button 
            key={key}
            onClick={() => setFilter(key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === key 
                ? value.color.replace('bg-', 'bg-').split(' ')[0] + ' text-white border-transparent' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => {
            const catInfo = COMPLAINT_CATEGORIES.find(c => c.id === complaint.category) || COMPLAINT_CATEGORIES[4];
            const urgencyInfo = URGENCY_LEVELS.find(u => u.id === complaint.urgency);
            const statusInfo = STATUS_TYPES[complaint.status];

            return (
              <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400">ID: {complaint.id}</span>
                    <span className="text-sm font-bold text-slate-800">{catInfo.label}</span>
                  </div>
                  <select 
                    value={complaint.status}
                    onChange={(e) => {
                      if (e.target.value === 'resolved' && !complaint.imageAfter) {
                        setActiveComplaint(complaint.id);
                      } else {
                        updateStatus(complaint.id, e.target.value);
                      }
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-slate-800 outline-none cursor-pointer ${statusInfo.color}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
                      {complaint.imageBefore ? (
                        <img src={complaint.imageBefore} className="w-full h-full object-cover" alt="Before" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Camera size={24} />
                        </div>
                      )}
                      <div className="absolute top-0 left-0 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5">BEFORE</div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">{complaint.description || "No description provided."}</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${urgencyInfo.color}`}>
                          {urgencyInfo.label} Priority
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600">
                          {complaint.supportCount} Supports
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resolution UI */}
                  {complaint.status === 'resolved' && complaint.imageAfter && (
                    <div className="mt-3 flex gap-2 items-center p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <img src={complaint.imageAfter} className="w-10 h-10 object-cover rounded" alt="After" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-800">Resolution Photo Added</p>
                        <p className="text-[10px] text-emerald-600">Issue has been fixed.</p>
                      </div>
                      <Check className="text-emerald-500" size={20} />
                    </div>
                  )}

                  {activeComplaint === complaint.id && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg border-dashed">
                      <p className="text-xs font-medium text-slate-700 mb-2">Please upload a proof photo to mark as resolved:</p>
                      <label className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-300 rounded cursor-pointer hover:bg-slate-50 transition-colors">
                        <Camera size={16} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Upload "After" Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageCapture(e, complaint.id)}
                        />
                      </label>
                      <button 
                        onClick={() => setActiveComplaint(null)}
                        className="w-full mt-2 text-xs text-slate-500 font-medium py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-10">
            <p className="text-slate-500 font-medium">No issues found matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
