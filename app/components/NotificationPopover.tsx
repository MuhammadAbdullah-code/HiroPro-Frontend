'use client';

import { useEffect, useRef } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';

export type HeaderNotification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
};

export default function NotificationPopover({ open, notifications, onClose, onRead, onReadAll, emptyMessage = 'You’re all caught up.' }: {
  open: boolean;
  notifications: HeaderNotification[];
  onClose: () => void;
  onRead?: (id: string) => void | Promise<void>;
  onReadAll?: () => void | Promise<void>;
  emptyMessage?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(item => !item.is_read).length;

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', dismiss); document.removeEventListener('keydown', escape); };
  }, [open, onClose]);

  if (!open) return null;
  return <div ref={panelRef} className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[#E4E7EC] bg-white text-left shadow-[0_18px_50px_rgba(16,24,40,.18)]">
    <header className="flex items-center justify-between border-b border-[#EAECF0] px-4 py-3.5">
      <div><p className="font-sora text-base font-bold text-[#1D2939]">Notifications</p><p className="mt-0.5 text-xs text-[#667085]">{unread ? `${unread} unread update${unread === 1 ? '' : 's'}` : 'No unread updates'}</p></div>
      <div className="flex items-center gap-1">{unread>0&&onReadAll&&<button onClick={()=>void onReadAll()} className="grid size-8 place-items-center rounded-md text-[#0F9D8C] hover:bg-[#ECFDF8]" aria-label="Mark all notifications as read" title="Mark all as read"><CheckCheck size={17}/></button>}<button onClick={onClose} className="grid size-8 place-items-center rounded-md text-[#667085] hover:bg-[#F2F4F7]" aria-label="Close notifications"><X size={17}/></button></div>
    </header>
    <div className="max-h-[25rem] overflow-y-auto">
      {notifications.length ? notifications.map(item => <button key={item.id} onClick={()=>{if(!item.is_read&&onRead)void onRead(item.id)}} disabled={item.is_read||!onRead} className={`flex w-full gap-3 border-b border-[#F0F2F5] px-4 py-3.5 text-left last:border-0 ${item.is_read?'bg-white':'bg-[#F2FBF9]'} ${!item.is_read&&onRead?'hover:bg-[#E8F8F4]':'cursor-default'}`}>
        <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.is_read?'bg-[#D0D5DD]':'bg-[#0F9D8C]'}`}/>
        <span className="min-w-0"><span className="block text-sm font-semibold text-[#344054]">{item.title}</span><span className="mt-1 block text-xs leading-5 text-[#667085]">{item.message}</span>{item.created_at&&<span className="mt-1.5 block text-[11px] text-[#98A2B3]">{new Date(item.created_at).toLocaleString()}</span>}</span>
      </button>) : <div className="grid min-h-48 place-items-center px-6 text-center"><div><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F2F4F7] text-[#98A2B3]"><Bell size={20}/></span><p className="mt-3 text-sm font-semibold text-[#344054]">{emptyMessage}</p><p className="mt-1 text-xs text-[#98A2B3]">New updates will appear here.</p></div></div>}
    </div>
  </div>;
}
