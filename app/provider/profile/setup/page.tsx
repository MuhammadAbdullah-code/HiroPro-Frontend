'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, FileCheck2, UploadCloud } from 'lucide-react';
import { Category, getApiErrorMessage, hireProApi, hydrateApiToken, Json, TOKEN_STORAGE_KEY } from '../../../lib/api';

type FormState = { category_id:string; name:string; description:string; city:string; address:string; phone:string; website:string };
type Documents = { cnic: File | null; professionalCertificate: File | null };
const emptyForm:FormState={category_id:'',name:'',description:'',city:'',address:'',phone:'',website:''};
const allowedDocumentTypes=['image/jpeg','image/png','image/webp','application/pdf'];
const maxFileSize=5*1024*1024;

export default function ProviderProfileSetupPage(){
 const router=useRouter();
 const [form,setForm]=useState<FormState>(emptyForm);
 const [documents,setDocuments]=useState<Documents>({cnic:null,professionalCertificate:null});
 const [categories,setCategories]=useState<Category[]>([]);
 const [verification,setVerification]=useState<Json|null>(null);
 const [existing,setExisting]=useState(false);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');

 useEffect(()=>{
  if(!localStorage.getItem(TOKEN_STORAGE_KEY)){router.replace('/provider/login?next=%2Fprovider%2Fprofile%2Fsetup');return}
  hydrateApiToken();
  Promise.all([hireProApi.auth.me(),hireProApi.categories.list(),hireProApi.provider.business().catch(()=>null),hireProApi.provider.verification().catch(()=>null)])
   .then(([user,categoryList,business,verificationRecord])=>{
    if(user.role!=='business'){router.replace('/customer/dashboard');return}
    setCategories(categoryList);setVerification(verificationRecord);
    if(business){setExisting(true);setForm({category_id:String(business.category_id??''),name:String(business.name??''),description:String(business.description??''),city:String(business.city??''),address:String(business.address??''),phone:String(business.phone??''),website:String(business.website??'')})}
    else if(categoryList[0])setForm(current=>({...current,category_id:categoryList[0].id}));
   }).catch(e=>setError(getApiErrorMessage(e,'Unable to load business setup.'))).finally(()=>setLoading(false));
 },[router]);

 const selectDocument=(key:keyof Documents)=>(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0]??null;if(file&&(!allowedDocumentTypes.includes(file.type)||file.size>maxFileSize)){event.target.value='';setDocuments(current=>({...current,[key]:null}));setError('Documents must be JPG, PNG, WebP, or PDF files no larger than 5 MB.');return}setError('');setDocuments(current=>({...current,[key]:file}))};
 const submit=async(event:FormEvent)=>{event.preventDefault();setError('');const hasCnic=!!documents.cnic,hasCertificate=!!documents.professionalCertificate;if(hasCnic!==hasCertificate){setError('Upload both CNIC and Professional Work Certificate together when replacing verification documents.');return}if(!existing&&(!hasCnic||!hasCertificate)){setError('CNIC and Professional Work Certificate are required to create a provider profile.');return}setSaving(true);try{let payload:{cnic_url:string;professional_work_certificate_url:string}|null=null;if(documents.cnic&&documents.professionalCertificate){const [cnic,certificate]=await Promise.all([hireProApi.uploads.create(documents.cnic),hireProApi.uploads.create(documents.professionalCertificate)]);payload={cnic_url:cnic.url,professional_work_certificate_url:certificate.url}}if(existing)await hireProApi.provider.updateBusiness(form);else{await hireProApi.provider.createBusiness(form);setExisting(true)}if(payload){const result=await hireProApi.provider.submitVerification(payload);setVerification(result)}router.replace('/provider/profile');router.refresh()}catch(e){setError(getApiErrorMessage(e,'Your profile was saved where possible, but verification is incomplete. Review the message and submit again.'))}finally{setSaving(false)}};

 return <main className="min-h-screen bg-[#F4F6FA] px-5 py-8 text-[#12122E] md:px-8"><div className="mx-auto max-w-3xl">
  <Link href="/provider/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F9D8C]"><ArrowLeft size={16}/>Back to business profile</Link>
  <section className="mt-6 overflow-hidden rounded-2xl border border-[#E3E7EC] bg-white shadow-sm">
   <header className="border-b border-[#E8EBEF] bg-gradient-to-r from-[#1E1B6E] to-[#2E3980] p-7 text-white"><span className="grid size-12 place-items-center rounded-xl bg-[#19C5A5]"><Building2/></span><h1 className="mt-5 font-sora text-3xl font-bold">{existing?'Update your business profile':'Create your business profile'}</h1><p className="mt-2 text-sm leading-6 text-white/70">Complete your business details and identity verification to start receiving customer requests.</p></header>
   {loading?<div className="p-8 text-sm text-[#667085]">Loading business setup…</div>:<form onSubmit={submit} className="grid gap-5 p-7 md:grid-cols-2">
    {error&&<p role="alert" className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}{verification&&<VerificationStatus value={verification}/>}<Field label="Business name" value={form.name} onChange={value=>setForm({...form,name:value})} required/>
    <label className="block"><span className="mb-2 block text-sm font-semibold">Category</span><select required value={form.category_id} onChange={event=>setForm({...form,category_id:event.target.value})} className="w-full rounded-lg border border-[#D8DCE4] bg-white px-3 py-3 text-sm"><option value="">Select a category</option>{categories.map(category=><option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <Field label="City" value={form.city} onChange={value=>setForm({...form,city:value})} required/><Field label="Phone" value={form.phone} onChange={value=>setForm({...form,phone:value})}/><Field label="Address" value={form.address} onChange={value=>setForm({...form,address:value})}/><Field label="Website" value={form.website} onChange={value=>setForm({...form,website:value})}/>
    <label className="block md:col-span-2"><span className="mb-2 block text-sm font-semibold">Business description</span><textarea required rows={5} value={form.description} onChange={event=>setForm({...form,description:event.target.value})} className="w-full rounded-lg border border-[#D8DCE4] px-3 py-3 text-sm outline-none focus:border-[#0F9D8C]"/></label>
    <section className="md:col-span-2 rounded-xl border border-[#DCE3E7] bg-[#F8FAFB] p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E5F6F2] text-[#0F9D8C]"><FileCheck2 size={20}/></span><div><h2 className="font-sora text-base font-bold">Work verification documents</h2><p className="mt-1 text-xs leading-5 text-[#667085]">Upload clear JPG, PNG, WebP, or PDF files up to 5 MB each. Replacement submissions require both documents.</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><DocumentField label="CNIC" file={documents.cnic} required={!existing} onChange={selectDocument('cnic')}/><DocumentField label="Professional Work Certificate" file={documents.professionalCertificate} required={!existing} onChange={selectDocument('professionalCertificate')}/></div>{existing&&<p className="mt-3 text-xs text-[#667085]">Leave both fields empty to keep the previous submission, or select both to submit a replacement review.</p>}</section>
    <div className="md:col-span-2 flex justify-end"><button disabled={saving} className="rounded-lg bg-[#0F9D8C] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving?'Uploading and saving…':existing?'Save changes':'Create and submit for verification'}</button></div>
   </form>}
  </section>
 </div></main>;
}

function VerificationStatus({value}:{value:Json}){const status=String(value.status??value.verification_status??(value.verified===true?'approved':'pending')).toLowerCase(),reason=String(value.rejection_reason??value.reason??'');const tone=status==='approved'||status==='verified'?'border-green-200 bg-green-50 text-green-800':status==='rejected'?'border-red-200 bg-red-50 text-red-800':'border-amber-200 bg-amber-50 text-amber-800';return <div className={`md:col-span-2 rounded-lg border p-4 text-sm ${tone}`}><p className="font-semibold capitalize">Verification status: {status}</p><p className="mt-1 text-xs">{status==='pending'?'Your documents are awaiting administrator review.':status==='rejected'?(reason||'Your documents were rejected. Upload both documents again for a new review.'):'Your provider documents have been approved.'}</p></div>}
function DocumentField({label,file,onChange,required}:{label:string;file:File|null;onChange:(event:ChangeEvent<HTMLInputElement>)=>void;required:boolean}){return <label className="block cursor-pointer rounded-lg border border-dashed border-[#B8C5CA] bg-white p-4 transition hover:border-[#0F9D8C]"><span className="flex items-center gap-2 text-sm font-semibold"><UploadCloud size={17} className="text-[#0F9D8C]"/>{label}{required&&<span className="text-red-500">*</span>}</span><span className="mt-2 block truncate text-xs text-[#667085]">{file?file.name:'Choose a file'}</span><input className="sr-only" type="file" required={required} accept="image/jpeg,image/png,image/webp,application/pdf" onChange={onChange}/></label>}
function Field({label,value,onChange,required=false}:{label:string;value:string;onChange:(value:string)=>void;required?:boolean}){return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><input required={required} value={value} onChange={event=>onChange(event.target.value)} className="w-full rounded-lg border border-[#D8DCE4] px-3 py-3 text-sm outline-none focus:border-[#0F9D8C]"/></label>}
