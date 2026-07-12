'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import adminApi from '@/lib/adminApi';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Lock, Mail, Loader2, ShieldOff,
  ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revokedMsg, setRevokedMsg] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const { setAuth, isAuthenticated, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (isAuthenticated) router.push('/admin/dashboard');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reason') === 'revoked') setRevokedMsg(true);
    }
  }, []);

  // Lockout timer countdown
  useEffect(() => {
    if (locked && lockTimer > 0) {
      const t = setTimeout(() => setLockTimer(l => l - 1), 1000);
      return () => clearTimeout(t);
    }
    if (locked && lockTimer === 0) setLocked(false);
  }, [locked, lockTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (locked) return toast.error(`Too many attempts. Wait ${lockTimer}s`);
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await adminApi.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res.data.data;
      setAuth({ user, accessToken, refreshToken });
      setAttempts(0);
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/admin/dashboard');
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        setLocked(true);
        setLockTimer(30);
        toast.error('Too many failed attempts. Locked for 30 seconds.');
      } else {
        toast.error(err.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Weak', color: '#f87171', w: '25%' };
    if (password.length < 10) return { label: 'Fair', color: '#fb923c', w: '50%' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Strong', color: '#4ade80', w: '100%' };
    return { label: 'Good', color: '#facc15', w: '75%' };
  };
  const strength = passwordStrength();

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Full page gradient background — light red */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 30%, #fecdd3 60%, #fda4af 100%)',
      }} />
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(220,38,38,0.15) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-60" style={{
        background: 'radial-gradient(circle, rgba(251,113,133,0.6) 0%, transparent 70%)',
        filter: 'blur(60px)',
        transform: 'translate(30%, -30%)',
      }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-50" style={{
        background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)',
        filter: 'blur(80px)',
        transform: 'translate(-30%, 30%)',
      }} />

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative z-10 p-12">
        <div className="max-w-md text-center">
          <div className="relative inline-flex items-center justify-center w-28 h-28 mb-8 rounded-3xl shadow-2xl"
            style={{ background: 'white', boxShadow: '0 20px 60px rgba(220,38,38,0.25)' }}>
            <Image src="/companylogo.jpeg" alt="ASP Cranes" width={100} height={100}
              className="object-contain rounded-2xl" priority />
          </div>
          <h1 className="text-5xl font-black mb-3" style={{ color: '#1e293b' }}>
            ASP <span style={{ color: '#dc2626' }}>Cranes</span>
          </h1>
          <p className="text-lg font-medium mb-8" style={{ color: '#64748b' }}>
            Content Management System
          </p>
          {/* Security badges */}
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, text: 'JWT Secured Authentication' },
              { icon: CheckCircle2, text: 'Role-Based Access Control' },
              { icon: Lock, text: 'Brute-Force Protection' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 px-5 py-3 rounded-2xl text-left"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(220,38,38,0.15)' }}>
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl mb-4 shadow-xl"
              style={{ background: 'white', boxShadow: '0 12px 40px rgba(220,38,38,0.2)' }}>
              <Image src="/companylogo.jpeg" alt="ASP Cranes" width={80} height={80}
                className="object-contain rounded-2xl" priority />
            </div>
            <h1 className="text-2xl font-black" style={{ color: '#1e293b' }}>
              ASP <span style={{ color: '#dc2626' }}>Cranes</span>
            </h1>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 24px 64px rgba(220,38,38,0.12), 0 4px 16px rgba(0,0,0,0.05)',
            }}>

            {/* Revoke Banner */}
            {revokedMsg && (
              <div className="flex items-start gap-3 mb-6 p-4 rounded-2xl"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <ShieldOff className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#991b1b' }}>Access Revoked</p>
                  <p className="text-xs mt-0.5" style={{ color: '#dc2626' }}>
                    Your access has been revoked by the administrator.
                  </p>
                </div>
              </div>
            )}

            {/* Lockout Banner */}
            {locked && (
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl"
                style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ea580c' }} />
                <p className="text-sm font-medium" style={{ color: '#9a3412' }}>
                  Too many attempts. Try again in <strong>{lockTimer}s</strong>
                </p>
              </div>
            )}

            <div className="mb-7">
              <h2 className="text-2xl font-black" style={{ color: '#0f172a' }}>Welcome back</h2>
              <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Sign in to your admin account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: '#475569', letterSpacing: '0.08em' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 w-5 h-5" style={{ color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@aspcranes.com"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl text-sm transition-all outline-none"
                    style={{
                      paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      color: '#0f172a',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#dc2626'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: '#475569', letterSpacing: '0.08em' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94a3b8' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl text-sm transition-all outline-none"
                    style={{
                      paddingLeft: '2.75rem', paddingRight: '3rem', paddingTop: '0.75rem', paddingBottom: '0.75rem',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      color: '#0f172a',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#dc2626'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
                    {showPass ? <EyeOff className="w-4.5 h-4.5 w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength indicator */}
                {strength && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: strength.w, background: strength.color }} />
                    </div>
                    <p className="text-[10px] mt-1 font-medium" style={{ color: strength.color }}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              {/* Attempts warning */}
              {attempts > 0 && attempts < 5 && (
                <p className="text-xs text-center font-medium" style={{ color: '#ea580c' }}>
                  {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before temporary lockout
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || locked}
                className="w-full flex items-center justify-center gap-2 font-bold rounded-xl transition-all"
                style={{
                  height: '52px',
                  background: locked ? '#94a3b8' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: locked || loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  boxShadow: locked ? 'none' : '0 4px 20px rgba(220,38,38,0.35)',
                }}
                onMouseEnter={e => { if (!locked && !loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                  : locked
                  ? `Locked (${lockTimer}s)`
                  : 'Launch Dashboard'}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#dc2626' }} />
              <p className="text-[10px] font-medium" style={{ color: '#94a3b8' }}>
                Secured with JWT · 256-bit encryption
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[10px] mt-5 font-medium" style={{ color: 'rgba(100,116,139,0.7)' }}>
            ASP Cranes CMS &mdash; Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
