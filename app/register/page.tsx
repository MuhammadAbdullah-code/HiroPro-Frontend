'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import { AccountRole, getApiErrorMessage, hireProApi, saveAccountRole } from '../lib/api';
import { useRouter } from 'next/navigation';

export function RegisterPage({ forcedRole }: { forcedRole?: AccountRole } = {}) {
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>(forcedRole ?? 'customer');
  const [serviceRequest, setServiceRequest] = useState(false);
  const [businessLogin, setBusinessLogin] = useState(false);
  const isCustomerSignup = forcedRole === 'customer' || serviceRequest;
  const isProviderSignup = forcedRole === 'business' || businessLogin;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setServiceRequest(params.get('serviceRequest') === '1');
    setBusinessLogin(params.get('businessLogin') === '1');
    if (forcedRole) {
      setRole(forcedRole);
      return;
    }
    const requestedRole = params.get('type');
    setRole(requestedRole === 'business' ? 'business' : 'customer');
  }, [forcedRole]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please tell us your name';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'We need your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "This doesn't look like a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Choose a secure password';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Include uppercase, lowercase, and a number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // Terms validation
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to continue';
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
      await hireProApi.auth.register({
        full_name: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        role,
      });
      saveAccountRole(role);
      router.push(isCustomerSignup
        ? '/customer/login?registered=1&serviceRequest=1'
        : isProviderSignup
          ? '/provider/login?registered=1&businessLogin=1'
          : `/${role === 'business' ? 'provider' : 'customer'}/login?registered=1`);
    } catch (error) {
      setErrors({ general: getApiErrorMessage(error, 'Something went wrong. Please try again.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Join the network — it's free."
      subheadline="Get instant access to trusted local professionals in your area."
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
            {isCustomerSignup ? 'Create Customer Account' : isProviderSignup ? 'Create Provider Account' : 'Create Account'}
          </h1>
          <p className="text-[#6B7280] font-inter">
            Join thousands finding trusted local businesses
          </p>
        </div>

        {/* General Error */}
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
          {!isCustomerSignup && !isProviderSignup && <div>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Account type">
              {(['customer', 'business'] as AccountRole[]).map(option => (
                forcedRole ? (
                  <Link key={option} href={`/${option === 'business' ? 'provider' : 'customer'}/signup`} className={`py-3 rounded-lg border text-center font-semibold transition-colors ${role === option ? 'bg-[#0F9D8C] border-[#0F9D8C] text-white' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#0F9D8C] hover:text-[#0F9D8C]'}`}>
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
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#12122E] mb-2 font-inter">
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                className={`w-full pl-12 pr-4 py-3.5 border rounded-lg outline-none transition-all font-inter ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-[#E5E7EB] focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/20'
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 font-inter"
              >
                {errors.fullName}
              </motion.p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#12122E] mb-2 font-inter">
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`w-full pl-12 pr-12 py-3.5 border rounded-lg outline-none transition-all font-inter ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-[#E5E7EB] focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/20'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded p-1"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 font-inter"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  if (errors.agreeToTerms) setErrors({ ...errors, agreeToTerms: undefined });
                }}
                className="mt-1 w-4 h-4 border-2 border-[#E5E7EB] rounded text-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/20 focus:ring-offset-0"
              />
              <span className="text-sm text-[#6B7280] group-hover:text-[#12122E] font-inter">
                I agree to the{' '}
                <Link href="/terms" className="text-[#0F9D8C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded px-1">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#0F9D8C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded px-1">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 font-inter"
              >
                {errors.agreeToTerms}
              </motion.p>
            )}
          </div>

          {/* Marketing Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1 w-4 h-4 border-2 border-[#E5E7EB] rounded text-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/20 focus:ring-offset-0"
              />
              <span className="text-sm text-[#6B7280] group-hover:text-[#12122E] font-inter">
                Send me offers and updates (optional)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0F9D8C] text-white rounded-lg font-semibold hover:bg-[#0D8A7B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sora mt-6 focus:outline-none focus:ring-2 focus:ring-[#0F9D8C] focus:ring-offset-2"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-[#6B7280] font-inter">
          Already have an account?{' '}
          <Link href={isCustomerSignup ? '/customer/login?serviceRequest=1' : isProviderSignup ? '/provider/login?businessLogin=1' : `/${role === 'business' ? 'provider' : 'customer'}/login`} className="text-[#0F9D8C] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F9D8C]/20 rounded px-1">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
