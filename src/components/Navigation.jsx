import React from 'react';
import { BellRing, FileText, LayoutDashboard, Settings, Wrench, Truck, User, LogOut, Monitor } from 'lucide-react';

const Navigation = ({ activeSection, setActiveSection, toggleKioskMode, handleLogout, user }) => {
  return (
    <div className="w-64 bg-gray-800 text-white dark:bg-gray-900">
      <div className="flex items-center justify-center mb-8">
        <Wrench size={24} className="mr-2" />
        <h1 className="text-xl font-bold">Repair Tracker</h1>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSection === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <LayoutDashboard size={20} className="mr-3" /> Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('requests')}
              className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSection === 'requests' ? 'bg-blue-600' : 'hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <BellRing size={20} className="mr-3" /> Repair Requests
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('equipment')}
              className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSection === 'equipment' ? 'bg-blue-600' : 'hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <Truck size={20} className="mr-3" /> Equipment
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('reports')}
              className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSection === 'reports' ? 'bg-blue-600' : 'hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <FileText size={20} className="mr-3" /> Reports
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('settings')}
              className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSection === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <Settings size={20} className="mr-3" /> Settings
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 w-64 p-4">
        <button 
          onClick={toggleKioskMode}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center justify-center"
        >
          <Monitor size={20} className="mr-2" /> Kiosk Mode
        </button>
        <div className="flex items-center border-t border-gray-700 pt-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <button 
              onClick={handleLogout}
              className="text-xs text-gray-400 flex items-center"
            >
              <LogOut size={12} className="mr-1" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;