'use client'

import React from 'react';
import { Egg, LayoutDashboard, Target, ReceiptText, Settings, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '#', icon: LayoutDashboard, current: true },
  { name: 'Goals', href: '#', icon: Target, current: false },
  { name: 'Transactions', href: '#', icon: ReceiptText, current: false },
  { name: 'Settings', href: '#', icon: Settings, current: false },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 z-30 md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-[81px] left-0 h-[calc(100vh_-_81px)] w-64 bg-slate-800 text-slate-50 flex flex-col z-40 shadow-2xl transition-transform duration-300 ease-in-out md:fixed md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Egg className="h-8 w-8 text-green-400" />
            <span className="text-xl font-bold text-slate-50">DinoNest</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-green-700 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
        <div className="p-6 mt-auto">
            <div className="p-4 text-center bg-slate-700/50 rounded-xl">
                <h3 className="font-bold text-green-400">Grow your Nest Egg!</h3>
                <p className="mt-1 text-xs text-slate-400">Upgrade to Pro for advanced insights.</p>
                <button className="w-full mt-4 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500 shadow-md transition-colors">
                    Upgrade
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;