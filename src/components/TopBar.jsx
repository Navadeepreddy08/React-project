import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-emerald-600 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/Emblem_of_Telangana.svg" alt="Logo" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
          <h1 className="text-xl font-bold tracking-tight">Village voice</h1>
        </div>
        <button 
          onClick={() => navigate('/admin')}
          className="p-2 hover:bg-emerald-700 rounded-full transition-colors flex flex-col items-center justify-center"
          title="Admin Dashboard"
        >
          <Shield size={22} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
