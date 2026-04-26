import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS } from '../utils/dummyData';

const ComplaintContext = createContext();

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('village_complaints_v2');
    if (saved) {
      return JSON.parse(saved);
    }
    return INITIAL_COMPLAINTS;
  });

  const [upvotedIds, setUpvotedIds] = useState(() => {
    const saved = localStorage.getItem('village_complaints_upvotes');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('village_complaints_v2', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('village_complaints_upvotes', JSON.stringify(upvotedIds));
  }, [upvotedIds]);

  const addComplaint = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  const updateStatus = (id, status, imageAfter = null) => {
    setComplaints(complaints.map(c => 
      c.id === id ? { ...c, status, ...(imageAfter && { imageAfter }) } : c
    ));
  };

  const upvoteComplaint = (id) => {
    if (upvotedIds.includes(id)) {
      setComplaints(complaints.map(c => 
        c.id === id ? { ...c, supportCount: Math.max(0, c.supportCount - 1) } : c
      ));
      setUpvotedIds(upvotedIds.filter(upvotedId => upvotedId !== id));
    } else {
      setComplaints(complaints.map(c => 
        c.id === id ? { ...c, supportCount: c.supportCount + 1 } : c
      ));
      setUpvotedIds([...upvotedIds, id]);
    }
  };

  const getComplaintById = (id) => {
    return complaints.find(c => c.id === id);
  };

  const getStats = () => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const pending = total - resolved;
    const highPriority = complaints.filter(c => c.urgency === 'high' && c.status !== 'resolved').length;
    return { total, resolved, pending, highPriority };
  };

  const resetData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setUpvotedIds([]);
    localStorage.removeItem('village_complaints_v2');
    localStorage.removeItem('village_complaints_upvotes');
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      upvotedIds,
      addComplaint,
      updateStatus,
      upvoteComplaint,
      getComplaintById,
      getStats,
      resetData
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};
