'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import AppLogo from '@/components/ui/AppLogo';
import { CheckCircle2, Users, TrendingUp, Shield } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const features = [
  { id: 'feat-projects', icon: TrendingUp, text: 'Track projects from kickoff to delivery' },
  { id: 'feat-team', icon: Users, text: 'Assign tasks and manage your team in one place' },
  { id: 'feat-roles', icon: Shield, text: 'Role-based access keeps the right people in control' },
  { id: 'feat-status', icon: CheckCircle2, text: 'Real-time status updates — no more check-in emails' },
];

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] shrink-0 bg-primary relative overflow-hidden p-10 xl:p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 left-1/3 w-48 h-48 rounded-full bg-white/5" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-16">
          <AppLogo size={40} />
          <span className="text-2xl font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Headline */}
        <div className="relative flex-1">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Ship projects.<br />Not status updates.
          </h1>
          <p className="text-lg text-white/70 mb-12 leading-relaxed">
            Give your team a single place to plan, assign, and track work — with the right access for everyone.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {features?.map((f) => {
              const Icon = f?.icon;
              return (
                <div key={f?.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-white/85 font-medium">{f?.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative mt-12 pt-8 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['SK', 'PR', 'MT', 'DL']?.map((initials, i) => (
                <div
                  key={`avatar-${initials}`}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-white">{initials}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">2,400+ teams trust TaskFlow</p>
              <p className="text-xs text-white/60">Across 60+ countries</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={32} />
          <span className="text-xl font-bold text-foreground">TaskFlow</span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-muted rounded-2xl p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === 'login' ?'bg-card text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === 'signup' ?'bg-card text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitchToSignup={() => setMode('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}