import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  return (
    <header className="fixed top-0 z-20 bg-slate-800 backdrop-blur-lg border-b border-slate-200 w-full">
      <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile menu button & App name */}
        <div className="flex items-center gap-4 mr-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-600 hover:text-slate-900"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-800 hidden sm:block md:hidden">
            DinoNest
          </h1>
        </div>

        {/* Search bar */}
        <div className="flex-1">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-900" />
            </span>
            <input
              type="search"
              placeholder="Search goals, transactions..."
              className="w-full max-w-sm py-2 pl-10 pr-4 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-slate-900"
            />
          </div>
        </div>

        {/* Right side icons and avatar */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors">
            <span className="sr-only">Notifications</span>
            <Bell className="h-6 w-6" />
          </button>
          
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 bg-linear-to-br from-green-400 to-amber-400 rounded-full flex items-center justify-center cursor-pointer shadow-inner">
            <span className="text-sm font-bold text-white">U</span>
            {/* TODO: Replace with user avatar image or initials */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;