'use client';
import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import DeleteProjectModal from './DeleteProjectModal';
import EmptyState from '@/components/ui/EmptyState';
import { FolderKanban } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  status: 'Active' | 'On Hold' | 'Completed';
  members: { id: string; name: string; initials: string; role: 'Admin' | 'Member' }[];
  tasks: { pending: number; inProgress: number; completed: number; overdue: number };
  deadline: string;
  createdAt: string;
}

const initialProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Website Rebrand',
    description: 'Full redesign of the company website — new brand identity, responsive layouts, and CMS integration.',
    owner: 'Arjun Kumar',
    ownerInitials: 'AK',
    status: 'Active',
    members: [
      { id: 'mem-ps', name: 'Priya Sharma', initials: 'PS', role: 'Member' },
      { id: 'mem-ab', name: 'Ananya Bose', initials: 'AB', role: 'Member' },
      { id: 'mem-km', name: 'Karan Mehta', initials: 'KM', role: 'Member' },
    ],
    tasks: { pending: 4, inProgress: 7, completed: 14, overdue: 2 },
    deadline: 'May 30, 2026',
    createdAt: 'Mar 15, 2026',
  },
  {
    id: 'proj-002',
    name: 'API v3 Migration',
    description: 'Migrate all internal and public-facing APIs from v2 to v3 with improved authentication and rate limiting.',
    owner: 'Arjun Kumar',
    ownerInitials: 'AK',
    status: 'Active',
    members: [
      { id: 'mem-rn', name: 'Rahul Nair', initials: 'RN', role: 'Member' },
      { id: 'mem-mp', name: 'Meera Pillai', initials: 'MP', role: 'Member' },
    ],
    tasks: { pending: 5, inProgress: 4, completed: 8, overdue: 3 },
    deadline: 'Jun 15, 2026',
    createdAt: 'Apr 01, 2026',
  },
  {
    id: 'proj-003',
    name: 'Mobile App MVP',
    description: 'Launch the first version of the iOS and Android mobile app with core e-commerce features.',
    owner: 'Arjun Kumar',
    ownerInitials: 'AK',
    status: 'Active',
    members: [
      { id: 'mem-km2', name: 'Karan Mehta', initials: 'KM', role: 'Member' },
      { id: 'mem-mp2', name: 'Meera Pillai', initials: 'MP', role: 'Member' },
      { id: 'mem-dr', name: 'Divya Reddy', initials: 'DR', role: 'Member' },
      { id: 'mem-ab2', name: 'Ananya Bose', initials: 'AB', role: 'Member' },
    ],
    tasks: { pending: 6, inProgress: 7, completed: 15, overdue: 0 },
    deadline: 'Jul 01, 2026',
    createdAt: 'Mar 28, 2026',
  },
  {
    id: 'proj-004',
    name: 'Data Pipeline Overhaul',
    description: 'Rebuild the ETL pipeline using Kafka and dbt to support real-time analytics and reduce processing lag.',
    owner: 'Arjun Kumar',
    ownerInitials: 'AK',
    status: 'On Hold',
    members: [
      { id: 'mem-dr2', name: 'Divya Reddy', initials: 'DR', role: 'Member' },
      { id: 'mem-rn2', name: 'Rahul Nair', initials: 'RN', role: 'Member' },
    ],
    tasks: { pending: 4, inProgress: 0, completed: 4, overdue: 0 },
    deadline: 'Aug 15, 2026',
    createdAt: 'Apr 10, 2026',
  },
  {
    id: 'proj-005',
    name: 'Customer Portal v2',
    description: 'Self-service customer portal with order tracking, invoice downloads, and support ticket management.',
    owner: 'Arjun Kumar',
    ownerInitials: 'AK',
    status: 'Active',
    members: [
      { id: 'mem-ps2', name: 'Priya Sharma', initials: 'PS', role: 'Member' },
      { id: 'mem-ab3', name: 'Ananya Bose', initials: 'AB', role: 'Member' },
    ],
    tasks: { pending: 8, inProgress: 3, completed: 2, overdue: 0 },
    deadline: 'Jul 20, 2026',
    createdAt: 'Apr 20, 2026',
  },
  {
    id: 'proj-006',
    name: 'Internal Tools Suite',
    description: 'Build admin tools for the ops team — bulk order management, user impersonation, and reporting dashboards.',
    owner: 'Arjun Kumar',
    ownerInitials: 'AK',
    status: 'Completed',
    members: [
      { id: 'mem-km3', name: 'Karan Mehta', initials: 'KM', role: 'Member' },
      { id: 'mem-mp3', name: 'Meera Pillai', initials: 'MP', role: 'Member' },
      { id: 'mem-rn3', name: 'Rahul Nair', initials: 'RN', role: 'Member' },
    ],
    tasks: { pending: 0, inProgress: 0, completed: 24, overdue: 0 },
    deadline: 'Apr 15, 2026',
    createdAt: 'Feb 01, 2026',
  },
];

type FilterStatus = 'All' | 'Active' | 'On Hold' | 'Completed';

export default function ProjectManagementContent() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setCreateOpen(false);
  };

  const handleEdit = (project: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    setEditProject(null);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteProject(null);
  };

  const statusCounts = {
    All: projects.length,
    Active: projects.filter((p) => p.status === 'Active').length,
    'On Hold': projects.filter((p) => p.status === 'On Hold').length,
    Completed: projects.filter((p) => p.status === 'Completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} projects · {projects.filter((p) => p.status === 'Active').length} active
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 h-9 text-sm"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['All', 'Active', 'On Hold', 'Completed'] as FilterStatus[]).map((s) => (
            <button
              key={`proj-filter-${s}`}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {s}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                statusFilter === s ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150 ${
              viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150 ${
              viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
            }`}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={
            search
              ? `No projects match "${search}" — try a different search term or clear the filter.`
              : 'You haven\'t created any projects yet. Create your first project to start assigning tasks.'
          }
          action={{ label: 'Create First Project', onClick: () => setCreateOpen(true) }}
        />
      ) : (
        <div
          className={
            viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4' :'flex flex-col gap-3'
          }
        >
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onEdit={() => setEditProject(project)}
              onDelete={() => setDeleteProject(project)}
            />
          ))}
        </div>
      )}

      {/* Create project modal */}
      <CreateProjectModal
        open={createOpen || editProject !== null}
        editProject={editProject}
        onClose={() => { setCreateOpen(false); setEditProject(null); }}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />

      {/* Delete confirm modal */}
      {deleteProject && (
        <DeleteProjectModal
          project={deleteProject}
          onClose={() => setDeleteProject(null)}
          onConfirm={() => handleDelete(deleteProject.id)}
        />
      )}
    </div>
  );
}