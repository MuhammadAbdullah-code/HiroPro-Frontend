'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Camera, Eye, EyeOff, LockKeyhole, Mail, Save, UserRound, X } from 'lucide-react';
import { getApiErrorMessage, hireProApi, Json, ProfileUpdateInput, User } from '../lib/api';

type DashboardRole = 'customer' | 'business' | 'admin';
type ProfileForm = { full_name: string; email: string; profile_image_url: string; current_password: string };

export default function AccountModal({ open, role, user, onClose, onUserUpdated }: {
  open: boolean;
  role: DashboardRole;
  user: User | null;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileForm>({ full_name: '', email: '', profile_image_url: '', current_password: '' });
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [tab, setTab] = useState<'profile' | 'security'>('profile');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!open) return;
    setError(''); setSuccess(''); setTab('profile');
    const load = async () => {
      const value = role === 'customer' ? await hireProApi.customer.profile()
        : role === 'business' ? await hireProApi.provider.profile()
        : await hireProApi.admin.me();
      const email = String(value.email ?? user?.email ?? '');
      const fullName = String(value.full_name ?? user?.full_name ?? '');
      const profileImageUrl = String(value.profile_image_url ?? '');
      setOriginalEmail(email);
      setOriginalName(fullName);
      setOriginalImageUrl(profileImageUrl);
      setProfile({ full_name: fullName, email, profile_image_url: profileImageUrl, current_password: '' });
    };
    load().catch(e => setError(getApiErrorMessage(e, 'Unable to load your profile.')));
  }, [open, role, user]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', close);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  const chooseImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setError('Choose a JPG, PNG, or WebP image smaller than 5 MB.'); return;
    }
    setBusy(true); setError('');
    try {
      const uploaded = await hireProApi.uploads.create(file);
      setProfile(current => ({ ...current, profile_image_url: uploaded.url }));
      setSuccess('Photo uploaded. Save your profile to apply it.');
    } catch (e) { setError(getApiErrorMessage(e, 'Unable to upload the image.')); }
    finally { setBusy(false); }
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('');
    const emailChanged = profile.email.trim() !== originalEmail;
    if (emailChanged && !profile.current_password) { setBusy(false); setError('Enter your current password to change your email address.'); return; }
    const fullName = profile.full_name.trim();
    const email = profile.email.trim();
    const payload: ProfileUpdateInput = role === 'admin' ? { full_name: fullName, email, profile_image_url: profile.profile_image_url } : {};
    if (fullName !== originalName) payload.full_name = fullName;
    if (profile.profile_image_url !== originalImageUrl) payload.profile_image_url = profile.profile_image_url;
    if (emailChanged) { payload.email = email; payload.current_password = profile.current_password; }
    if (role !== 'admin' && Object.keys(payload).length === 0) { setBusy(false); setSuccess('Your profile is already up to date.'); return; }
    try {
      const result = role === 'customer' ? await hireProApi.customer.updateProfile(payload)
        : role === 'business' ? await hireProApi.provider.updateProfile(payload)
        : user ? await hireProApi.admin.update('admins', user.id, payload) : {};
      const updated = { ...user, ...result, full_name: profile.full_name.trim(), email: profile.email.trim(),
        profile_image_url: profile.profile_image_url, avatar: profile.profile_image_url } as User;
      onUserUpdated(updated); setOriginalEmail(updated.email); setOriginalName(updated.full_name); setOriginalImageUrl(profile.profile_image_url); setProfile(current => ({...current, current_password: ''})); setSuccess('Profile updated successfully.');
    } catch (e) { setError(getApiErrorMessage(e, 'Unable to update your profile.')); }
    finally { setBusy(false); }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (passwords.new_password.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (passwords.new_password !== passwords.confirm_password) { setError('New passwords do not match.'); return; }
    setBusy(true);
    const payload = { current_password: passwords.current_password, new_password: passwords.new_password };
    try {
      if (role === 'customer') await hireProApi.customer.updateProfile(payload);
      else if (role === 'business') await hireProApi.provider.updateProfile(payload);
      else if (user) await hireProApi.admin.update('admins', user.id, payload);
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      setSuccess('Password changed successfully.');
    } catch (e) { setError(getApiErrorMessage(e, 'Unable to change your password.')); }
    finally { setBusy(false); }
  };

  const initials = profile.full_name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'HP';
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-[#111827]/55 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-label="Account settings" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-5">
        <div><h2 className="font-sora text-xl font-bold text-[#17172F]">Account profile</h2><p className="mt-1 text-xs text-[#667085]">Manage your personal details and security.</p></div>
        <button onClick={onClose} className="grid size-9 place-items-center rounded-lg text-[#667085] hover:bg-[#F2F4F7]" aria-label="Close profile"><X size={20}/></button>
      </header>
      <div className="border-b border-[#EAECF0] px-6 pt-4"><div className="flex gap-6">{(['profile','security'] as const).map(item=><button key={item} onClick={()=>{setTab(item);setError('');setSuccess('')}} className={`border-b-2 pb-3 text-sm font-semibold capitalize ${tab===item?'border-[#0F9D8C] text-[#0F7F72]':'border-transparent text-[#667085]'}`}>{item}</button>)}</div></div>
      <div className="p-6">
        {error&&<p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success&&<p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
        {tab==='profile'?<form onSubmit={saveProfile} className="space-y-5">
          <div className="flex items-center gap-5 rounded-xl bg-[#F7F9FA] p-4">
            <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1E1B6E] text-xl font-bold text-white">{profile.profile_image_url?<img src={profile.profile_image_url} alt="Profile" className="h-full w-full object-cover"/>:initials}<button type="button" onClick={()=>fileRef.current?.click()} className="absolute inset-x-0 bottom-0 grid h-7 place-items-center bg-black/55" aria-label="Change profile image"><Camera size={14}/></button></div>
            <div><p className="font-semibold text-[#344054]">Profile photo</p><p className="mt-1 text-xs text-[#667085]">JPG, PNG or WebP. Maximum 5 MB.</p><button disabled={busy} type="button" onClick={()=>fileRef.current?.click()} className="mt-2 text-xs font-semibold text-[#0F9D8C]">Upload new photo</button><input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage}/></div>
          </div>
          <Field icon={<UserRound/>} label="Full name" value={profile.full_name} onChange={value=>setProfile({...profile,full_name:value})}/>
          <Field icon={<Mail/>} label="Email address" type="email" value={profile.email} onChange={value=>setProfile({...profile,email:value})}/>
          {profile.email.trim()!==originalEmail&&<PasswordField label="Current password (required to change email)" value={profile.current_password} show={showPasswords} onChange={value=>setProfile({...profile,current_password:value})}/>} 
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F9D8C] py-3 text-sm font-semibold text-white disabled:opacity-60"><Save size={17}/>{busy?'Saving…':'Save profile'}</button>
        </form>:<form onSubmit={changePassword} className="space-y-5">
          <div className="rounded-xl border border-[#E4E7EC] bg-[#F8FAFB] p-4 text-sm text-[#667085]"><p className="font-semibold text-[#344054]">Choose a strong password</p><p className="mt-1 text-xs leading-5">Use at least 8 characters and avoid reusing a password from another account.</p></div>
          <PasswordField label="Current password" value={passwords.current_password} show={showPasswords} onChange={value=>setPasswords({...passwords,current_password:value})}/>
          <PasswordField label="New password" value={passwords.new_password} show={showPasswords} onChange={value=>setPasswords({...passwords,new_password:value})}/>
          <PasswordField label="Confirm new password" value={passwords.confirm_password} show={showPasswords} onChange={value=>setPasswords({...passwords,confirm_password:value})}/>
          <button type="button" onClick={()=>setShowPasswords(value=>!value)} className="flex items-center gap-2 text-xs font-semibold text-[#667085]">{showPasswords?<EyeOff size={15}/>:<Eye size={15}/>} {showPasswords?'Hide':'Show'} passwords</button>
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E1B6E] py-3 text-sm font-semibold text-white disabled:opacity-60"><LockKeyhole size={17}/>{busy?'Updating…':'Change password'}</button>
        </form>}
      </div>
    </section>
  </div>;
}

function Field({icon,label,value,onChange,type='text',required=true}:{icon:React.ReactNode;label:string;value:string;onChange:(value:string)=>void;type?:string;required?:boolean}){return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#344054]">{label}</span><span className="relative block"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A0AF] [&>svg]:size-[17px]">{icon}</span><input required={required} type={type} value={value} onChange={event=>onChange(event.target.value)} className="w-full rounded-lg border border-[#D8DCE4] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/10"/></span></label>}
function PasswordField({label,value,onChange,show}:{label:string;value:string;onChange:(value:string)=>void;show:boolean}){return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#344054]">{label}</span><span className="relative block"><LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A0AF]"/><input required type={show?'text':'password'} value={value} onChange={event=>onChange(event.target.value)} className="w-full rounded-lg border border-[#D8DCE4] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0F9D8C] focus:ring-2 focus:ring-[#0F9D8C]/10"/></span></label>}
