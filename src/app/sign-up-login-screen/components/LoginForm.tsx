'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Copy, Check } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface Credential {
  role: string;
  email: string;
  password: string;
}

const mockCredentials: Credential[] = [
  { role: 'Admin', email: 'arjun.kumar@taskflow.io', password: 'Admin@TaskFlow9' },
  { role: 'Member', email: 'priya.sharma@taskflow.io', password: 'Member@Flow7' },
];

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { rememberMe: false } });

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const autofill = (cred: Credential) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
    setAuthError('');
  };

  // Backend integration point: POST /api/auth/login
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError('');
    await new Promise((r) => setTimeout(r, 1200));
    const valid = mockCredentials.find(
      (c) => c.email === data.email && c.password === data.password
    );
    if (valid) {
      router.push('/dashboard');
    } else {
      setAuthError('Invalid credentials — use the demo accounts below to sign in');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your TaskFlow workspace</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Auth error */}
        {authError && (
          <div className="flex items-start gap-3 px-4 py-3 bg-danger/8 border border-danger/20 rounded-xl">
            <p className="text-sm text-danger font-medium">{authError}</p>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold text-foreground mb-1.5">
            Work Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            className={`input-field ${errors.email ? 'border-danger focus:ring-danger/40 focus:border-danger' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-danger font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-sm font-semibold text-foreground">
              Password
            </label>
            <button type="button" className="text-xs text-primary font-medium hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`input-field pr-10 ${errors.password ? 'border-danger focus:ring-danger/40 focus:border-danger' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            id="login-remember"
            type="checkbox"
            className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
            {...register('rememberMe')}
          />
          <label htmlFor="login-remember" className="text-sm text-muted-foreground cursor-pointer select-none">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-11 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            'Sign In to TaskFlow'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center my-6">
        <div className="flex-1 border-t border-border" />
        <span className="mx-3 text-xs font-medium text-muted-foreground bg-background px-2">Demo Accounts</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Demo credentials */}
      <div className="rounded-2xl border border-border bg-muted/40 overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/60 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Click any row to autofill
          </p>
        </div>
        <div className="divide-y divide-border">
          {mockCredentials.map((cred) => (
            <div
              key={`cred-${cred.role}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors duration-150 group"
              onClick={() => autofill(cred)}
            >
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  cred.role === 'Admin' ?'bg-primary/10 text-primary' :'bg-success/10 text-success'
                }`}
              >
                {cred.role}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{cred.email}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{cred.password}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCopy(cred.email, `email-${cred.role}`); }}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-border"
                  aria-label="Copy email"
                >
                  {copiedField === `email-${cred.role}` ? (
                    <Check size={11} className="text-success" />
                  ) : (
                    <Copy size={11} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account yet?{' '}
        <button onClick={onSwitchToSignup} className="text-primary font-semibold hover:underline">
          Create one free
        </button>
      </p>
    </div>
  );
}