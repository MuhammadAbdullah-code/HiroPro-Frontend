'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Mail, MapPin } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { getApiErrorMessage, hireProApi } from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await hireProApi.auth.forgotPassword(normalizedEmail);
      setSent(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to send the reset link. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout headline="Get back to your account." subheadline="Recover access securely and continue connecting with trusted local professionals.">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <Link href="/" className="mb-9 flex items-center justify-center gap-2 text-2xl font-bold text-[#1E1B6E] font-sora">
        <MapPin size={27}/><span>HirePro</span>
      </Link>

      {sent ? <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-[#0F9D8C]"><CheckCircle2 size={32}/></span>
        <h1 className="mt-6 font-sora text-3xl font-bold text-[#12122E]">Check your email</h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">If an account exists for <strong className="text-[#344054]">{email.trim()}</strong>, we&apos;ve sent instructions to reset its password.</p>
        <p className="mt-3 text-xs leading-5 text-[#98A2B3]">The link may take a few minutes to arrive. Check your spam folder too.</p>
        <button onClick={()=>setSent(false)} className="mt-7 w-full rounded-lg border border-[#C9D0D1] bg-white py-3 text-sm font-semibold text-[#344054] hover:bg-[#F8FAFB]">Try another email</button>
        <Link href="/login" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F9D8C]"><ArrowLeft size={16}/>Back to login</Link>
      </div> : <>
        <div className="text-center">
          <h1 className="font-sora text-3xl font-bold text-[#12122E]">Forgot your password?</h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">Enter your account email and we&apos;ll send you a secure password-reset link.</p>
        </div>

        {error&&<motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</motion.p>}

        <form onSubmit={submit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#344054]">Email address</span>
            <span className="relative block">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"/>
              <input autoFocus required type="email" autoComplete="email" value={email} onChange={event=>{setEmail(event.target.value);if(error)setError('')}} placeholder="you@example.com" className="w-full rounded-lg border border-[#D8DCE4] bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/10"/>
            </span>
          </label>
          <button disabled={loading} className="w-full rounded-lg bg-[#0F9D8C] py-3.5 font-sora text-sm font-semibold text-white transition hover:bg-[#0C897A] disabled:cursor-not-allowed disabled:opacity-60">{loading?'Sending reset link…':'Send reset link'}</button>
        </form>

        <Link href="/login" className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#0F9D8C]"><ArrowLeft size={16}/>Back to login</Link>
      </>}
    </motion.div>
  </AuthLayout>;
}
