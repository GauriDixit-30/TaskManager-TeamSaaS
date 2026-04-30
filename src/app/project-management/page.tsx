import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProjectManagementContent from './components/ProjectManagementContent';

export default function ProjectManagementPage() {
  return (
    <AppLayout currentPath="/project-management">
      <ProjectManagementContent />
    </AppLayout>
  );
}