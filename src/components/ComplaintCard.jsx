import React from 'react';
import { ThumbsUp, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';
import { STATUS_TYPES, URGENCY_LEVELS, COMPLAINT_CATEGORIES } from '../utils/dummyData';

const ComplaintCard = ({ complaint }) => {
  const { upvoteComplaint } = useComplaints();
  
  const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.id === complaint.category) || COMPLAINT_CATEGORIES[4];
  const urgencyInfo = URGENCY_LEVELS.find(u => u.id === complaint.urgency) || URGENCY_LEVELS[0];
  const statusInfo = STATUS_TYPES[complaint.status] || STATUS_TYPES.pending;

  const handleUpvote = (e) => {
    e.stopPropagation();
    upvoteComplaint(complaint.id);
  };

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4 transition-all hover:shadow-md">
      {complaint.imageBefore && (
        <div className="h-48 w-full overflow-hidden relative">
          <img 
            src={complaint.imageBefore} 
            alt="Issue" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${urgencyInfo.color}`}>
              {urgencyInfo.label} Priority
            </span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${categoryInfo.color}`}>
              {/* Note: In a real app we'd map the icon string to actual Lucide component */}
              <span className="text-xs font-semibold">{categoryInfo.label}</span>
            </span>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-md ${statusInfo.color} flex items-center gap-1`}>
            {complaint.status === 'resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
            {statusInfo.label}
          </span>
        </div>
        
        <p className="text-slate-800 text-sm mt-3 line-clamp-2">{complaint.description}</p>
        
        <div className="flex items-center text-slate-500 text-xs mt-3 gap-1">
          <MapPin size={14} />
          <span>Location: {complaint.location?.lat.toFixed(4)}, {complaint.location?.lng.toFixed(4)}</span>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
          <span className="text-slate-400 text-xs">{formattedDate}</span>
          
          <button 
            onClick={handleUpvote}
            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors text-sm font-medium"
          >
            <ThumbsUp size={16} />
            <span>{complaint.supportCount} Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
