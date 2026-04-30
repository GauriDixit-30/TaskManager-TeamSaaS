'use client';
import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Calendar, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { Project } from './ProjectManagementContent';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Active: { label: 'Active', className: 'bg-success/10 text-success' },
  'On Hold': { label: 'On Hold', className: 'bg-warning/10 text-warning' },
  Completed: { label: 'Completed', className: 'bg-primary/10 text-primary' },
};

const projectColors = [
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-indigo-600',
];

export default function ProjectCard({ project, viewMode, onEdit, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const totalTasks =
    project.tasks.pending +
    project.tasks.inProgress +
    project.tasks.completed +
    project.tasks.overdue;
  const completionPct = totalTasks > 0 ? Math.round((project.tasks.completed / totalTasks) * 100) : 0;
  const colorIdx = parseInt(project.id.replace('proj-', ''), 10) % projectColors.length;
  const gradientClass = projectColors[colorIdx - 1] || projectColors[0];
  const statusStyle = statusConfig[project.status];

  if (viewMode === 'list') {
    return (
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-elevated transition-shadow duration-200">
        {/* Color bar */}
        <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${gradientClass} shrink-0 hidden sm:block`} />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">{project.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.className}`}>
              {statusStyle.label}
            </span>
            {project.tasks.overdue > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger">
                {project.tasks.overdue} overdue
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.description}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-24">
            <div className="flex justify-between text-[10px] font-semibold mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{completionPct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* Members */}
          <div className="flex -space-x-1.5">
            {project.members.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="w-7 h-7 rounded-full bg-primary/15 border-2 border-card flex items-center justify-center"
                title={m.name}
              >
                <span className="text-[9px] font-bold text-primary">{m.initials}</span>
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                <span className="text-[9px] font-bold text-muted-foreground">+{project.members.length - 3}</span>
              </div>
            )}
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            <Calendar size={12} />
            {project.deadline}
          </div>

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors duration-150"
              aria-label="Project actions"
            >
              <MoreHorizontal size={15} className="text-muted-foreground" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-36 bg-card border border-border rounded-xl shadow-elevated py-1 animate-fade-in">
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Pencil size={12} /> Edit project
                </button>
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-danger hover:bg-danger/8"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden hover:shadow-elevated transition-shadow duration-200 flex flex-col">
      {/* Card header gradient */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-bold text-foreground">{project.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.className}`}>
                {statusStyle.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors duration-150"
              aria-label="Project actions"
            >
              <MoreHorizontal size={15} className="text-muted-foreground" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-36 bg-card border border-border rounded-xl shadow-elevated py-1 animate-fade-in">
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Pencil size={12} /> Edit project
                </button>
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-danger hover:bg-danger/8"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task status pills */}
        <div className="grid grid-cols-4 gap-1.5">
          <div className="flex flex-col items-center gap-0.5 bg-muted/60 rounded-xl py-2">
            <Clock size={12} className="text-warning" />
            <span className="text-xs font-bold text-foreground tabular-nums">{project.tasks.pending}</span>
            <span className="text-[9px] text-muted-foreground font-medium">Pending</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 bg-muted/60 rounded-xl py-2">
            <PlayCircle size={12} className="text-accent" />
            <span className="text-xs font-bold text-foreground tabular-nums">{project.tasks.inProgress}</span>
            <span className="text-[9px] text-muted-foreground font-medium">Active</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 bg-muted/60 rounded-xl py-2">
            <CheckCircle2 size={12} className="text-success" />
            <span className="text-xs font-bold text-foreground tabular-nums">{project.tasks.completed}</span>
            <span className="text-[9px] text-muted-foreground font-medium">Done</span>
          </div>
          <div className={`flex flex-col items-center gap-0.5 rounded-xl py-2 ${
            project.tasks.overdue > 0 ? 'bg-danger/10' : 'bg-muted/60'
          }`}>
            <AlertCircle size={12} className={project.tasks.overdue > 0 ? 'text-danger' : 'text-muted-foreground'} />
            <span className={`text-xs font-bold tabular-nums ${project.tasks.overdue > 0 ? 'text-danger' : 'text-foreground'}`}>
              {project.tasks.overdue}
            </span>
            <span className="text-[9px] text-muted-foreground font-medium">Overdue</span>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold text-muted-foreground">Completion</span>
            <span className="font-bold text-foreground tabular-nums">{completionPct}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-700`}
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
          {/* Member avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {project.members.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="w-6 h-6 rounded-full bg-primary/15 border-2 border-card flex items-center justify-center"
                  title={m.name}
                >
                  <span className="text-[8px] font-bold text-primary">{m.initials}</span>
                </div>
              ))}
              {project.members.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-[8px] font-bold text-muted-foreground">+{project.members.length - 4}</span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar size={11} />
            <span>{project.deadline}</span>
          </div>
        </div>
      </div>
    </div>
  );
}