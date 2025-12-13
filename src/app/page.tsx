"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center font-sans bg-linear-to-br from-slate-900 via-slate-800 to-green-900">
      <Navbar setSidebarOpen={setIsOpen} />
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
