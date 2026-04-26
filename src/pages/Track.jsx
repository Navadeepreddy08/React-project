import React, { useState } from 'react';
import { Search, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { COMPLAINT_CATEGORIES, STATUS_TYPES, URGENCY_LEVELS } from '../utils/dummyData';

const Track = () => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { getComplaintById } = useComplaints();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setHasSearched(true);
    const complaint = getComplaintById(trackingId.trim().toUpperCase());
    setResult(complaint || null);
  };

  const renderStatusTimeline = (currentStatus) => {
    const statuses = ['pending', 'in_progress', 'resolved'];
    const currentIndex = statuses.indexOf(currentStatus);

    return (
      <div className="relative mt-8 mb-4">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        ></div>
        
        <div className="flex justify-between relative z-10">
          {statuses.map((status, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const statusInfo = STATUS_TYPES[status];
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 ${
                  isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                  {isActive ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>
                <span className={`text-[10px] font-bold mt-2 uppercase ${
                  isActive ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-slate-50 min-h-full">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Track Issue</h2>
        <p className="text-sm text-slate-500 mb-4">Enter your complaint tracking ID to see its current status.</p>
        
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. CMP-1234"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {hasSearched && (
        <div>
          {result ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-emerald-50/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-500">Tracking ID</span>
                  <span className="text-sm font-medium text-slate-500">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{result.id}</h3>
                
                {renderStatusTimeline(result.status)}
              </div>

              {result.imageAfter ? (
                <div className="grid grid-cols-2">
                  <div className="relative h-32">
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 z-10 rounded-br">BEFORE</div>
                    <img src={result.imageBefore} className="w-full h-full object-cover" alt="Before" />
                  </div>
                  <div className="relative h-32">
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 z-10 rounded-br">AFTER</div>
                    <img src={result.imageAfter} className="w-full h-full object-cover" alt="After" />
                  </div>
                </div>
              ) : (
                result.imageBefore && (
                  <img src={result.imageBefore} className="w-full h-48 object-cover" alt="Reported issue" />
                )
              )}

              <div className="p-5 space-y-4">
                {(() => {
                  const catInfo = COMPLAINT_CATEGORIES.find(c => c.id === result.category) || COMPLAINT_CATEGORIES[4];
                  const urgencyInfo = URGENCY_LEVELS.find(u => u.id === result.urgency);
                  
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${catInfo.color}`}>
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Category</p>
                          <p className="font-bold text-slate-800">{catInfo.label}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin size={16} />
                          <span className="text-xs font-medium">Location Captured</span>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${urgencyInfo.color}`}>
                          {urgencyInfo.label} Priority
                        </span>
                      </div>

                      {result.description && (
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Description</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{result.description}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">No Issue Found</h3>
              <p className="text-sm text-slate-500">We couldn't find any complaint with the ID "{trackingId}". Please check and try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Track;
