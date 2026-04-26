import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Map as MapIcon, Search, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/report', icon: PlusCircle, label: 'Report' },
    { path: '/map', icon: MapIcon, label: 'Map' },
    { path: '/track', icon: Search, label: 'Track' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
              }`
            }
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
