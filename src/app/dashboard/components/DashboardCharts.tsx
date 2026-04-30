'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const TaskTrendChart = dynamic(() => import('./TaskTrendChart'), { ssr: false });
const TasksPerProjectChart = dynamic(() => import('./TasksPerProjectChart'), { ssr: false });

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
      {/* Task completion trend — wider */}
      <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-3">
        <TaskTrendChart />
      </div>
      {/* Tasks per project — narrower */}
      <div className="lg:col-span-2 xl:col-span-2 2xl:col-span-2">
        <TasksPerProjectChart />
      </div>
    </div>
  );
}