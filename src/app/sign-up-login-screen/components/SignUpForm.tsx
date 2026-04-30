'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Shield, Users } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'Admin' | 'Member';
  agreeTerms: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  const map: Record<number, PasswordStrength> = {
    0: { score: 0, label: '', color: '' },
    1: { score: 1, label: 'Weak', color: 'bg-danger' },
    2: { score: 2, label: 'Fair', color: 'bg-warning' },
    3: { score: 3, label: 'Good', color: 'bg-accent' },
    4: { score: 4, label: 'Strong', color: 'bg-success' },
    5: { score: 5, label: 'Very Strong', color: 'bg-success' },
  };
  return map[Math.min(score, 5)];
}

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export default function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({ defaultValues: { role: 'Member', agreeTerms: false } });

  const passwordValue = watch('password', '');
  const selectedRole = watch('role');
  const strength = getPasswordStrength(passwordValue);

  // Backend integration point: POST /api/auth/signup
  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Start managing projects in under 2 minutes</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full name */}
        <div>
          <label htmlFor="signup-name" className="block text-sm font-semibold text-foreground mb-1.5">
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            placeholder="Priya Sharma"
            className={`input-field ${errors.name ? 'border-danger focus:ring-danger/40' : ''}`}
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
          {errors.name && <p className="mt-1.5 text-xs text-danger font-medium">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-semibold text-foreground mb-1.5">
            Work Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@company.com"
            className={`input-field ${errors.email ? 'border-danger focus:ring-danger/40' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
          />
          {errors.email && <p className="mt-1.5 text-xs text-danger font-medium">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-semibold text-foreground mb-1.5">
            Password
          </label>
          <p className="text-xs text-muted-foreground mb-1.5">
            Min 8 characters, one uppercase, one number, one special character
          </p>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className={`input-field pr-10 ${errors.password ? 'border-danger focus:ring-danger/40' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
                  message: 'Must include uppercase, number, and special character',
                },
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
          {/* Strength meter */}
          {passwordValue.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={`strength-${level}`}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                      level <= strength.score ? strength.color : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              {strength.label && (
                <p className={`text-[11px] font-semibold ${
                  strength.score <= 1 ? 'text-danger' :
                  strength.score === 2 ? 'text-warning' :
                  strength.score === 3 ? 'text-accent' : 'text-success'
                }`}>
                  {strength.label}
                </p>
              )}
            </div>
          )}
          {errors.password && <p className="mt-1.5 text-xs text-danger font-medium">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-semibold text-foreground mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className={`input-field pr-10 ${errors.confirmPassword ? 'border-danger focus:ring-danger/40' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordValue || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-danger font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Role selector */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Your Role</label>
          <p className="text-xs text-muted-foreground mb-3">
            Choose how you'll primarily use TaskFlow
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(['Admin', 'Member'] as const).map((role) => {
              const Icon = role === 'Admin' ? Shield : Users;
              const desc = role === 'Admin' ?'Create projects, assign tasks, manage team' :'View assigned tasks, update status';
              return (
                <button
                  key={`role-${role}`}
                  type="button"
                  onClick={() => setValue('role', role)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                    selectedRole === role
                      ? 'border-primary bg-secondary/60' :'border-border bg-card hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedRole === role ? 'bg-primary/15' : 'bg-muted'
                  }`}>
                    <Icon className={`w-4 h-4 ${selectedRole === role ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${selectedRole === role ? 'text-primary' : 'text-foreground'}`}>
                      {role}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register('role', { required: true })} />
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-start gap-2.5">
            <input
              id="signup-terms"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
              {...register('agreeTerms', {
                required: 'You must accept the terms to continue',
              })}
            />
            <label htmlFor="signup-terms" className="text-sm text-muted-foreground cursor-pointer select-none">
              I agree to TaskFlow's{' '}
              <span className="text-primary font-medium hover:underline cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary font-medium hover:underline cursor-pointer">Privacy Policy</span>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="mt-1.5 text-xs text-danger font-medium">{errors.agreeTerms.message}</p>
          )}
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
              <span>Creating account…</span>
            </>
          ) : (
            'Create Free Account'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline">
          Sign in instead
        </button>
      </p>
    </div>
  );
}