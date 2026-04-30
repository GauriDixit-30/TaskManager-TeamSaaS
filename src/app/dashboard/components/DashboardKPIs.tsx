import React from 'react';
import {
  CheckSquare,
  CheckCircle2,
  PlayCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface KPICard {
  id: string;
  label: string;
  value: number;
  subtext: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
  span?: 'wide';
}

const kpiData: KPICard[] = [
  {
    id: 'kpi-total',
    label: 'Total Tasks',
    value: 84,
    subtext: 'Across 4 active projects',
    icon: CheckSquare,
    trend: 'up',
    trendValue: '+12 this week',
    variant: 'default',
    span: 'wide',
  },
  {
    id: 'kpi-completed',
    label: 'Completed',
    value: 41,
    subtext: '48.8% completion rate',
    icon: CheckCircle2,
    trend: 'up',
    trendValue: '+8 since Monday',
    variant: 'success',
  },
  {
    id: 'kpi-inprogress',
    label: 'In Progress',
    value: 23,
    subtext: 'Across 9 team members',
    icon: PlayCircle,
    trend: 'neutral',
    trendValue: 'No change today',
    variant: 'info',
  },
  {
    id: 'kpi-pending',
    label: 'Pending',
    value: 15,
    subtext: 'Not yet started',
    icon: Clock,
    trend: 'down',
    trendValue: '-3 assigned today',
    variant: 'warning',
  },
  {
    id: 'kpi-overdue',
    label: 'Overdue',
    value: 5,
    subtext: 'Requires immediate action',
    icon: AlertCircle,
    trend: 'up',
    trendValue: '+2 since yesterday',
    variant: 'danger',
  },
];

const variantStyles: Record<string, { bg: string; iconBg: string; iconColor: string; valueColor: string }> = {
  default: {
    bg: 'bg-card border-border',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    valueColor: 'text-foreground',
  },
  success: {
    bg: 'bg-card border-border',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    valueColor: 'text-foreground',
  },
  info: {
    bg: 'bg-card border-border',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    valueColor: 'text-foreground',
  },
  warning: {
    bg: 'bg-card border-border',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    valueColor: 'text-foreground',
  },
  danger: {
    bg: 'bg-danger/5 border-danger/25',
    iconBg: 'bg-danger/15',
    iconColor: 'text-danger',
    valueColor: 'text-danger',
  },
};

export default function DashboardKPIs() {
  return (
    // 5 cards: wide hero (spans 2) + 4 regular = grid-cols-4, row1: 2+1+1, row2: 1+1+... 
    // Plan: grid-cols-2 md:grid-cols-4 — hero spans 2 cols, rest fill 2+2
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {kpiData.map((card) => {
        const Icon = card.icon;
        const styles = variantStyles[card.variant];
        const TrendIcon = card.trend === 'up' ? TrendingUp : card.trend === 'down' ? TrendingDown : Minus;
        const trendColor =
          card.variant === 'danger' ?'text-danger'
            : card.trend === 'up' ?'text-success'
            : card.trend === 'down' ?'text-warning' :'text-muted-foreground';

        return (
          <div
            key={card.id}
            className={`
              card p-5 border flex flex-col gap-3
              ${styles.bg}
              ${card.span === 'wide' ? 'col-span-2' : 'col-span-1'}
            `}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground tracking-wide">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                <Icon className={`w-4.5 h-4.5 ${styles.iconColor}`} size={18} />
              </div>
            </div>
            <div>
              <p className={`text-4xl font-bold tabular-nums leading-none ${styles.valueColor}`}>
                {card.value}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">{card.subtext}</p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${trendColor}`}>
              <TrendIcon size={13} />
              <span>{card.trendValue}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}