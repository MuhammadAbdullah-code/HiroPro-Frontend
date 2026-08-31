'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import { AccountRole, dashboardForRole, getApiErrorMessage, hireProApi, saveAccountRole, saveApiToken, TOKEN_STORAGE_KEY } from '../lib/api';
import { useRouter } from 'next/navigation';

export function LoginPage({ forcedRole }: { forcedRole?: AccountRole } = {}) {
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>(forcedRole ?? 'customer');
  const [registered, setRegistered] = useState(false);
  const [serviceRequest, setServiceRequest] = useState(false);
  const [businessLogin, setBusinessLogin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRole(forcedRole ?? (params.get('role') === 'business' ? 'business' : 'customer'));
    setRegistered(params.get('registered') === '1');
    setServiceRequest(params.get('serviceRequest') === '1');
    setBusinessLogin(params.get('businessLogin') === '1');
  }, [forcedRole]);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "This doesn't look like a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { access_token } = await hireProApi.auth.login(formData);
      saveApiToken(access_token);
      const user = await hireProApi.auth.me();

      if (forcedRole && user.role !== forcedRole) {
        await hireProApi.auth.logout().catch(() => undefined);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        hireProApi.setToken(null);
        const accountType = user.role === 'business' ? 'service provider' : 'customer';
        const loginType = forcedRole === 'business' ? 'service provider' : 'customer';
        setErrors({
          general: `This is a ${accountType} account. Please use the ${accountType} login instead of the ${loginType} login.`,
        });
        return;
      }

      saveAccountRole(user.role);
      const requestedPath = new URLSearchParams(window.location.search).get('next');
      const rolePrefix = user.role === 'business' ? '/provider/' : '/customer/';
      const safeDestination = requestedPath?.startsWith(rolePrefix)
        ? requestedPath
        : dashboardForRole(user.role);
      router.replace(user.is_admin ? '/admin/dashboard' : safeDestination);
    } catch (error) {
      setErrors({ general: getApiErrorMessage(error, 'Something went wrong. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Welcome back to the network."
      subheadline="Connect with local professionals and manage your bookings."
    >
      <div className="w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <FaMapMarkerAlt className="w-7 h-7 text-[#1E1B6E]" />
          <span className="text-2xl font-bold font-sora text-[#1E1B6E]">HirePro</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#12122E] mb-2 font-sora">
            {serviceRequest ? 'Customer Login' : businessLogin ? 'Provider Login' : 'Log In'}
          </h1>
          <p className="text-[#6B7280] font-inter">
            Enter your credentials to access your account
          </p>
        </div>

        {/* General Error */}
        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-inter">
            Account created. Log in to open your {role === 'business' ? 'provider' : 'customer'} dashboard.
          </div>
        )}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-inter"
          >
            {errors.general}
          </motion.div>
        )}

          {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!serviceRequest && !businessLogin && <div>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Account type">
              {(['customer', 'business'] as AccountRole[]).map(option => (
                forcedRole ? (
                  <Link key={option} href={`/${option === 'business' ? 'provider' : 'customer'}/login`} className={`py-3 rounded-lg border text-center font-semibold transition-colors ${role === option ? 'bg-[#0F9D8C] border-[#0F9D8C] text-white' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#0F9D8C] hover:text-[#0F9D8C]'}`}>
                    {option === 'business' ? 'Service Provider' : 'Customer'}
                  </Link>
                ) : (
                  <button key={option} type="button" onClick={() => setRole(option)} className={`py-3 rounded-lg border font-semibold transition-colors ${role === option ? 'bg-[#0F9D8C] border-[#0F9D8C] text-white' : 'border-[#E5E7EB] text-[#6B7280]'}`}>
                    {option === 'business' ? 'Service Provider' : 'Customer'}
                  </button>
                )
              ))}
            </div>
          </div>}
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#12122E] mb-2 font-inter">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full pl-12 pr-4 py-3.5 border rounded-lg outline-none transition-all font-inter ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-[#E5E7EB] focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/20'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 font-inter"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#12122E] mb-2 font-inter">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full pl-12 pr-12 py-3.5 border rounded-lg outline-none transition-all font-inter ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-[#E5E7EB] focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/20'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 font-inter"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#0F9D8C] hover:underline font-inter focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded px-1"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0F9D8C] text-white rounded-lg font-semibold hover:bg-[#0D8A7B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sora focus:outline-none focus:ring-2 focus:ring-[#0F9D8C] focus:ring-offset-2"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-[#6B7280] font-inter">
          Don't have an account?{' '}
          <Link href={serviceRequest ? '/customer/signup?serviceRequest=1' : businessLogin ? '/provider/signup?businessLogin=1' : `/${role === 'business' ? 'provider' : 'customer'}/signup`} className="text-[#0F9D8C] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded px-1">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
