import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { complaints, getStats } = useComplaints();
  const navigate = useNavigate();
  const stats = getStats();
  const [showAll, setShowAll] = useState(false);

  const displayedComplaints = showAll
    ? [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="p-4 bg-slate-50 min-h-full pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-600 rounded-2xl p-5 text-white shadow-lg mb-6"
      >
        <h2 className="text-2xl font-bold mb-1">Raise your voice. Fix your village.</h2>
        <p className="text-emerald-100 text-sm mb-4">Report local problems in 30 seconds. Everyone can see. Everyone helps.</p>

        <button
          onClick={() => navigate('/report')}
          className="w-full bg-white text-emerald-700 font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <AlertCircle size={20} />
          Report a New Issue
        </button>
      </motion.div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-3 px-1">Village Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-700">{stats.total}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">Total Issues</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-emerald-500">{stats.resolved}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">Resolved</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-yellow-500">{stats.pending}</span>
            <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1"><Clock size={12} /> Pending</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-red-500">{stats.highPriority}</span>
            <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1"><ShieldAlert size={12} /> High Priority</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-lg font-bold text-slate-800">{showAll ? 'All Issues' : 'Recent Issues'}</h3>
          {complaints.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-emerald-600 text-sm font-medium"
            >
              {showAll ? 'Show less' : 'See all'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {displayedComplaints.length > 0 ? (
            displayedComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-100 text-slate-500">
              <CheckCircle2 size={48} className="mx-auto text-emerald-200 mb-2" />
              <p>No active issues. The village is doing great!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
