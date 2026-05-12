import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const inputClass =
  'w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);

  // Support both legacy state.from and new ?returnTo= query param
  const returnTo = searchParams.get('returnTo')
    ? decodeURIComponent(searchParams.get('returnTo'))
    : location.state?.from?.pathname || '/';

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Fill admin credentials with one click
  const fillAdminCredentials = () => {
    setForm({ email: 'admin@ishoes.com', password: 'admin@123' });
    setShowAdminHint(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!form.password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(form);
      login(response.user, response.token);
      // Redirect admin to dashboard, others to returnTo
      if (response.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_30px_80px_rgba(11,11,11,0.1)]">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent" />

          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-sm font-bold text-white shadow-[0_10px_28px_rgba(11,11,11,0.18)]">
              I
            </div>
            <span className="text-xl font-semibold">
              I.<span className="text-[#00A85A]">Shoes</span>
            </span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/40">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-black">Sign in</h1>
          <p className="mt-2 text-sm text-black/55">
            Access your cart, orders, and wishlist.
          </p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <span className="mt-0.5 text-red-400">⚠</span>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  className={`${inputClass} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.15em] text-black/40 hover:text-black/70 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black/50">
            No account?{' '}
            <Link
              to={`/register${searchParams.get('returnTo') ? `?returnTo=${searchParams.get('returnTo')}` : ''}`}
              className="font-semibold text-[#00A85A] hover:underline"
            >
              Create one free
            </Link>
          </p>

          {/* Admin access hint */}
          <div className="mt-6 border-t border-black/5 pt-5">
            <button
              type="button"
              onClick={() => setShowAdminHint((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-black/35 hover:text-black/60 transition"
            >
              <span>Admin access</span>
              <span className={`transition-transform duration-200 ${showAdminHint ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            <AnimatePresence>
              {showAdminHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-2xl border border-black/8 bg-black/[0.02] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                      Default admin credentials
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                        <span className="text-xs text-black/45">Email</span>
                        <code className="text-xs font-semibold text-black">
                          admin@ishoes.com
                        </code>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                        <span className="text-xs text-black/45">Password</span>
                        <code className="text-xs font-semibold text-black">
                          admin@123
                        </code>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={fillAdminCredentials}
                      className="mt-3 w-full rounded-full border border-black/10 py-2.5 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
                    >
                      Use admin credentials
                    </button>
                    <p className="mt-2 text-center text-[10px] text-black/30">
                      Admin is auto-redirected to the dashboard after login
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
