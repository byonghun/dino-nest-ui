"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout, getUserData, isAuthenticated } from '@/lib/auth';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize user state from localStorage
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Mark component as mounted (this is client-side only)
    const timer = setTimeout(() => {
      setIsMounted(true);
      
      // Check authentication status
      if (isAuthenticated()) {
        const userData = getUserData();
        if (userData) {
          setUserEmail(userData.email);
          setIsLoggedIn(true);
        }
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserEmail("");
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };
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
          
          {/* Avatar with Dropdown - Only render after mount to prevent hydration mismatch */}
          {!isMounted ? (
            // Placeholder during SSR/initial render
            <div className="w-10 h-10" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-linear-to-br from-green-400 to-amber-400 rounded-full flex items-center justify-center cursor-pointer shadow-inner hover:shadow-lg transition-shadow"
              >
                <span className="text-sm font-bold text-white">
                  {getInitials(userEmail)}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {userEmail}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // Navigate to profile if needed
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      <UserIcon className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;