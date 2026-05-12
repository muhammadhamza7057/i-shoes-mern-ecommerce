import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const returnTo = searchParams.get('returnTo')
    ? decodeURIComponent(searchParams.get('returnTo'))
    : '/';

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(form);
      // Auto-login after registration and respect returnTo
      if (response.token && response.user) {
        login(response.user, response.token);
        navigate(returnTo, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_30px_80px_rgba(11,11,11,0.1)]"
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent" />

        {/* Logo mark */}
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-sm font-bold text-white shadow-[0_10px_28px_rgba(11,11,11,0.18)]">
            I
          </div>
          <span className="text-xl font-semibold">
            I.<span className="text-[#00A85A]">Shoes</span>
          </span>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/40">
          New account
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-black">Join I.Shoes</h1>
        <p className="mt-2 text-sm text-black/55">
          Free to join. Shop, save, and track your orders.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={form.firstName}
                onChange={handleChange('firstName')}
                placeholder="Alex"
                className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={form.lastName}
                onChange={handleChange('lastName')}
                placeholder="Jordan"
                className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Min. 6 characters"
                className="w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 pr-12 text-sm text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition"
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
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black/50">
          Already have an account?{' '}
          <Link
            to={`/login${searchParams.get('returnTo') ? `?returnTo=${searchParams.get('returnTo')}` : ''}`}
            className="font-semibold text-[#00A85A] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
