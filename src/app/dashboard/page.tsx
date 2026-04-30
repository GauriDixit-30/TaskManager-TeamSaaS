import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardKPIs from './components/DashboardKPIs';
import DashboardCharts from './components/DashboardCharts';
import RecentTasksTable from './components/RecentTasksTable';
import OverdueAlertBanner from './components/OverdueAlertBanner';

export default function DashboardPage() {
  return (
    <AppLayout currentPath="/dashboard">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Good morning, Arjun — here's what needs your attention today
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block" />
            Updated just now
          </div>
        </div>

        <OverdueAlertBanner />
        <DashboardKPIs />
        <DashboardCharts />
        <RecentTasksTable />
      </div>
    </AppLayout>
  );
}