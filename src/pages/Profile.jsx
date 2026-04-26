import React from 'react';
import { User, Phone, MapPin, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';

const Profile = () => {
  const { complaints } = useComplaints();
  
  // Assuming the user has submitted 1 complaint for dummy display purposes
  const myComplaintsCount = complaints.length > 0 ? 1 : 0;

  return (
    <div className="p-4 bg-slate-50 min-h-full pb-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Ramesh Kumar</h2>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <MapPin size={14} /> Main Street, Ward 4
          </p>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
            <Phone size={14} /> +91 98765 43210
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center">
          <span className="text-3xl font-black">{myComplaintsCount}</span>
          <span className="text-xs text-emerald-100 font-medium mt-1">My Reports</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-700">12</span>
          <span className="text-xs text-slate-500 font-medium mt-1">Upvotes Given</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Settings & Help</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700">
              <Settings size={20} className="text-slate-400" />
              <span className="font-medium">Account Settings</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700">
              <HelpCircle size={20} className="text-slate-400" />
              <span className="font-medium">Help & Support</span>
            </div>
          </button>
        </div>
      </div>

      <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
        <LogOut size={20} />
        Log Out
      </button>
    </div>
  );
};

export default Profile;
