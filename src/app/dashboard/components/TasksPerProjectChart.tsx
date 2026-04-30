'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

const projectData = [
  { project: 'Website Rebrand', total: 24, completed: 14, overdue: 2 },
  { project: 'API v3 Migration', total: 19, completed: 8, overdue: 3 },
  { project: 'Mobile App MVP', total: 28, completed: 15, overdue: 0 },
  { project: 'Data Pipeline', total: 13, completed: 4, overdue: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-elevated px-4 py-3 text-xs">
      <p className="font-semibold text-foreground mb-2 truncate max-w-[160px]">{label}</p>
      {payload.map((entry: any) => (
        <div key={`bar-tooltip-${entry.name}`} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-bold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const shortLabel = (name: string) => {
  const map: Record<string, string> = {
    'Website Rebrand': 'Website',
    'API v3 Migration': 'API v3',
    'Mobile App MVP': 'Mobile',
    'Data Pipeline': 'Data',
  };
  return map[name] || name;
};

export default function TasksPerProjectChart() {
  return (
    <div className="card p-5 h-full">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">Tasks per Project</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Total vs. completed breakdown</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={projectData}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barCategoryGap="28%"
          barGap={3}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="project"
            tickFormatter={shortLabel}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" fill="var(--secondary-foreground)" radius={[4, 4, 0, 0]} opacity={0.25} name="total" />
          <Bar dataKey="completed" fill="var(--primary)" radius={[4, 4, 0, 0]} name="completed" />
        </BarChart>
      </ResponsiveContainer>

      {/* Project legend */}
      <div className="mt-4 space-y-2">
        {projectData.map((p) => {
          const pct = Math.round((p.completed / p.total) * 100);
          return (
            <div key={`proj-legend-${p.project}`} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-foreground truncate">{shortLabel(p.project)}</p>
                  <span className="text-[11px] font-bold text-muted-foreground tabular-nums">{pct}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              {p.overdue > 0 && (
                <span className="text-[10px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded-full shrink-0">
                  {p.overdue} late
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}