'use client';
import React, { useState } from 'react';
import { Search, Bell, Plus, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className={`relative flex items-center flex-1 max-w-xs transition-all duration-200 ${searchFocused ? 'max-w-sm' : ''}`}>
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search tasks, projects…"
          className="input-field pl-9 py-2 text-sm h-9"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Quick create */}
      <Link
        href="/project-management"
        className="btn-primary flex items-center gap-2 h-9 text-xs"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Task</span>
      </Link>

      {/* Notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors duration-150">
        <Bell className="w-4.5 h-4.5 text-muted-foreground" size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-warning rounded-full border-2 border-card" />
      </button>

      {/* User menu */}
      <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-muted transition-colors duration-150">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">AK</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-foreground leading-tight">Arjun Kumar</p>
          <p className="text-[11px] text-muted-foreground leading-tight">Admin</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </header>
  );
}