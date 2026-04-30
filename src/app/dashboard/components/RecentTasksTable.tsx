'use client';
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Pencil, Trash2, Filter } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';


type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  priority: 'High' | 'Medium' | 'Low';
  status: TaskStatus;
  deadline: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Design new homepage hero section',
    project: 'Website Rebrand',
    assignee: 'Priya Sharma',
    assigneeInitials: 'PS',
    priority: 'High',
    status: 'In Progress',
    deadline: 'May 03, 2026',
    createdAt: 'Apr 25, 2026',
  },
  {
    id: 'task-002',
    title: 'Migrate authentication endpoints to v3',
    project: 'API v3 Migration',
    assignee: 'Rahul Nair',
    assigneeInitials: 'RN',
    priority: 'High',
    status: 'Overdue',
    deadline: 'Apr 28, 2026',
    createdAt: 'Apr 18, 2026',
  },
  {
    id: 'task-003',
    title: 'Write unit tests for payment module',
    project: 'API v3 Migration',
    assignee: 'Meera Pillai',
    assigneeInitials: 'MP',
    priority: 'Medium',
    status: 'Pending',
    deadline: 'May 07, 2026',
    createdAt: 'Apr 27, 2026',
  },
  {
    id: 'task-004',
    title: 'Implement push notification flow',
    project: 'Mobile App MVP',
    assignee: 'Karan Mehta',
    assigneeInitials: 'KM',
    priority: 'High',
    status: 'In Progress',
    deadline: 'May 05, 2026',
    createdAt: 'Apr 22, 2026',
  },
  {
    id: 'task-005',
    title: 'Set up Kafka consumer for event streaming',
    project: 'Data Pipeline',
    assignee: 'Divya Reddy',
    assigneeInitials: 'DR',
    priority: 'Medium',
    status: 'Overdue',
    deadline: 'Apr 27, 2026',
    createdAt: 'Apr 15, 2026',
  },
  {
    id: 'task-006',
    title: 'Conduct user interviews for onboarding flow',
    project: 'Website Rebrand',
    assignee: 'Ananya Bose',
    assigneeInitials: 'AB',
    priority: 'Low',
    status: 'Completed',
    deadline: 'Apr 29, 2026',
    createdAt: 'Apr 20, 2026',
  },
  {
    id: 'task-007',
    title: 'Optimize database query performance',
    project: 'API v3 Migration',
    assignee: 'Rahul Nair',
    assigneeInitials: 'RN',
    priority: 'High',
    status: 'Overdue',
    deadline: 'Apr 26, 2026',
    createdAt: 'Apr 17, 2026',
  },
  {
    id: 'task-008',
    title: 'Create offline mode fallback screens',
    project: 'Mobile App MVP',
    assignee: 'Karan Mehta',
    assigneeInitials: 'KM',
    priority: 'Medium',
    status: 'Pending',
    deadline: 'May 10, 2026',
    createdAt: 'Apr 28, 2026',
  },
  {
    id: 'task-009',
    title: 'Write data transformation pipeline docs',
    project: 'Data Pipeline',
    assignee: 'Divya Reddy',
    assigneeInitials: 'DR',
    priority: 'Low',
    status: 'Completed',
    deadline: 'Apr 30, 2026',
    createdAt: 'Apr 19, 2026',
  },
  {
    id: 'task-010',
    title: 'QA testing — mobile checkout flow',
    project: 'Mobile App MVP',
    assignee: 'Meera Pillai',
    assigneeInitials: 'MP',
    priority: 'High',
    status: 'In Progress',
    deadline: 'May 02, 2026',
    createdAt: 'Apr 24, 2026',
  },
];

const priorityColors: Record<string, string> = {
  High: 'text-danger bg-danger/10',
  Medium: 'text-warning bg-warning/10',
  Low: 'text-success bg-success/10',
};

type SortKey = 'title' | 'project' | 'assignee' | 'priority' | 'status' | 'deadline';

export default function RecentTasksTable() {
  const [sortKey, setSortKey] = useState<SortKey>('deadline');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = mockTasks.filter(
    (t) => statusFilter === 'All' || t.status === statusFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] as string;
    const bv = b[sortKey] as string;
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-border" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  const statusOptions: (TaskStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Completed', 'Overdue'];

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Tasks</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} tasks shown</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={`filter-${s}`}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {(
                [
                  { key: 'title', label: 'Task Title' },
                  { key: 'project', label: 'Project' },
                  { key: 'assignee', label: 'Assignee' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'status', label: 'Status' },
                  { key: 'deadline', label: 'Deadline' },
                ] as { key: SortKey; label: string }[]
              ).map((col) => (
                <th
                  key={`th-${col.key}`}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((task) => (
              <tr
                key={task.id}
                className={`group hover:bg-muted/40 transition-colors duration-100 ${
                  task.status === 'Overdue' ? 'bg-danger/3' : ''
                }`}
              >
                {/* Title */}
                <td className="px-4 py-3 max-w-[220px]">
                  <p className="font-medium text-foreground truncate" title={task.title}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Added {task.createdAt}</p>
                </td>

                {/* Project */}
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-secondary-foreground bg-secondary px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {task.project}
                  </span>
                </td>

                {/* Assignee */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary">{task.assigneeInitials}</span>
                    </div>
                    <span className="text-sm text-foreground whitespace-nowrap">{task.assignee}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>

                {/* Deadline */}
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold tabular-nums ${
                    task.status === 'Overdue' ? 'text-danger' : 'text-foreground'
                  }`}>
                    {task.deadline}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="relative flex justify-end">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors duration-150 opacity-0 group-hover:opacity-100"
                      aria-label="Task actions"
                    >
                      <MoreHorizontal size={15} className="text-muted-foreground" />
                    </button>

                    {openMenuId === task.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 bg-card border border-border rounded-xl shadow-elevated py-1 animate-fade-in">
                        <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors duration-100">
                          <Eye size={13} className="text-muted-foreground" />
                          View details
                        </button>
                        <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors duration-100">
                          <Pencil size={13} className="text-muted-foreground" />
                          Edit task
                        </button>
                        <div className="my-1 border-t border-border" />
                        <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-danger hover:bg-danger/8 transition-colors duration-100">
                          <Trash2 size={13} />
                          Delete task
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{sorted.length}</span> of{' '}
          <span className="font-semibold text-foreground">{mockTasks.length}</span> tasks
        </p>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((page) => (
            <button
              key={`page-${page}`}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors duration-150 ${
                page === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="text-muted-foreground text-xs px-1">…</span>
          <button className="w-7 h-7 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors duration-150">
            9
          </button>
        </div>
      </div>
    </div>
  );
}