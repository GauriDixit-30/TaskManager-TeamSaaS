import React from 'react';
import { Clock, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type Status = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const config: Record<Status, { icon: React.ElementType; className: string; label: string }> = {
  Pending: { icon: Clock, className: 'badge-pending', label: 'Pending' },
  'In Progress': { icon: PlayCircle, className: 'badge-inprogress', label: 'In Progress' },
  Completed: { icon: CheckCircle2, className: 'badge-completed', label: 'Completed' },
  Overdue: { icon: AlertCircle, className: 'badge-overdue', label: 'Overdue' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { icon: Icon, className, label } = config[status];
  return (
    <span className={`${className} ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''}`}>
      <Icon size={size === 'sm' ? 10 : 11} />
      {label}
    </span>
  );
}