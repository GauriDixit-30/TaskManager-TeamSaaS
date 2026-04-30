import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OverdueAlertBanner() {
  const overdueCount = 5;

  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-danger/8 border border-danger/25 rounded-2xl">
      <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-4.5 h-4.5 text-danger" size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-danger">
          {overdueCount} tasks are past their deadline
        </p>
        <p className="text-xs text-danger/70 mt-0.5">
          These tasks need immediate attention — deadlines were missed on or before Apr 28, 2026
        </p>
      </div>
      <Link
        href="/project-management"
        className="flex items-center gap-1.5 text-xs font-semibold text-danger border border-danger/30 px-3 py-1.5 rounded-xl hover:bg-danger/10 transition-colors duration-150 shrink-0"
      >
        Review overdue
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}