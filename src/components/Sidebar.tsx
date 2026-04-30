'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'nav-projects', label: 'Projects', href: '/project-management', icon: FolderKanban, badge: 4 },
  { id: 'nav-tasks', label: 'My Tasks', href: '/dashboard', icon: CheckSquare, badge: 3 },
  { id: 'nav-team', label: 'Team', href: '/project-management', icon: Users },
];

const bottomItems: NavItem[] = [
  { id: 'nav-notifications', label: 'Notifications', href: '/dashboard', icon: Bell, badge: 2 },
  { id: 'nav-settings', label: 'Settings', href: '/dashboard', icon: Settings },
];

interface SidebarProps {
  currentPath: string;
}

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => currentPath === href;

  return (
    <aside
      className={`
        relative flex flex-col bg-card border-r border-border h-screen
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight">TaskFlow</span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-10 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors duration-150"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Workspace selector */}
      {!collapsed && (
        <div className="mx-3 mt-4 mb-2 px-3 py-2.5 bg-secondary/60 rounded-xl border border-secondary cursor-pointer hover:bg-secondary transition-colors duration-150">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Workspace</p>
          <p className="text-sm font-semibold text-foreground truncate">Acme Corp</p>
        </div>
      )}
      {collapsed && <div className="h-4" />}

      {/* Nav section label */}
      {!collapsed && (
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Main
        </p>
      )}

      {/* Main nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${active
                  ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className={`shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} size={18} />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-foreground text-card text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-elevated">
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="ml-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-1 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 pb-3 space-y-0.5 border-t border-border pt-3">
        {!collapsed && (
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Account
          </p>
        )}
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className="shrink-0" size={18} />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="ml-auto bg-warning text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-warning rounded-full" />
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-foreground text-card text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-elevated">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* User profile */}
        <div className={`mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors duration-150 group ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">AK</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Arjun Kumar</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          )}
          {!collapsed && (
            <LogOut className="shrink-0 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-foreground text-card text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-elevated">
              Arjun Kumar — Admin
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}