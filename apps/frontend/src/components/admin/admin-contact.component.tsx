'use client';

import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import copy from 'copy-to-clipboard';
import Link from 'next/link';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useUser } from '@hookpost/frontend/components/layout/user.context';
import { useToaster } from '@hookpost/react/toaster/toaster';
import { LoadingComponent } from '@hookpost/frontend/components/layout/loading';

type State = 'NEW' | 'READ' | 'DONE';

interface ContactMessage {
  id: string;
  name: string | null;
  email: string;
  topic: string;
  message: string;
  state: State;
  ip: string | null;
  userAgent: string | null;
  emailSent: boolean;
  emailError: string | null;
  createdAt: string;
}

interface Response {
  messages: ContactMessage[];
  total: number;
  newCount: number;
  failedCount: number;
}

const STATE_STYLES: Record<State, string> = {
  NEW: 'bg-[#FF4CE2]/15 text-[#FF4CE2] border-[#FF4CE2]/30',
  READ: 'bg-white/5 text-textColor border-newTableBorder',
  DONE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

const when = (iso: string) => {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Row: FC<{ row: ContactMessage; onState: (id: string, s: State) => void }> = ({
  row,
  onState,
}) => {
  const [open, setOpen] = useState(false);
  const toaster = useToaster();

  return (
    <div className="border border-newTableBorder rounded-[8px] bg-newBgColorInner overflow-hidden">
      <div
        className="flex items-start gap-[12px] p-[14px] cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] flex-wrap">
            <span
              className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-[600] border ${STATE_STYLES[row.state]}`}
            >
              {row.state}
            </span>
            <span className="px-[8px] py-[2px] rounded-[4px] text-[11px] font-[500] bg-white/5 border border-newTableBorder">
              {row.topic}
            </span>
            {!row.emailSent && (
              <span
                className="px-[8px] py-[2px] rounded-[4px] text-[11px] font-[600] bg-amber-500/10 text-amber-400 border border-amber-500/30"
                title={row.emailError || 'The notification email did not send'}
              >
                email failed
              </span>
            )}
            <span className="text-[12px] opacity-60">{when(row.createdAt)}</span>
          </div>
          <div className="mt-[6px] text-[14px] font-[600] text-white truncate">
            {row.name || '(no name)'}{' '}
            <span className="font-[400] opacity-70">{row.email}</span>
          </div>
          {!open && (
            <div className="mt-[2px] text-[13px] opacity-70 truncate">
              {row.message}
            </div>
          )}
        </div>
        <div className="text-[12px] opacity-50 shrink-0">{open ? '▲' : '▼'}</div>
      </div>

      {open && (
        <div className="px-[14px] pb-[14px] flex flex-col gap-[12px]">
          <pre className="whitespace-pre-wrap break-words text-[13px] leading-[1.6] bg-newBgColorInnerInner border border-newTableBorder rounded-[8px] p-[12px]">
            {row.message}
          </pre>

          {row.emailError && (
            <div className="text-[12px] text-amber-400 break-words">
              Email error: {row.emailError}
            </div>
          )}

          <div className="text-[11px] opacity-50 break-words">
            {row.ip ? `IP ${row.ip}` : 'no IP'}
            {row.userAgent ? ` · ${row.userAgent}` : ''}
          </div>

          <div className="flex flex-wrap gap-[8px]">
            <a
              href={`mailto:${row.email}?subject=${encodeURIComponent(
                `Re: [${row.topic}] Hookpost`
              )}`}
              className="px-[14px] h-[32px] flex items-center rounded-[6px] text-[13px] font-[600] bg-primary text-white hover:opacity-90"
            >
              Reply by email
            </a>
            <button
              type="button"
              onClick={() => {
                copy(row.email);
                toaster.show('Email copied', 'success');
              }}
              className="px-[14px] h-[32px] rounded-[6px] text-[13px] font-[500] bg-white/5 border border-newTableBorder hover:bg-white/10"
            >
              Copy address
            </button>
            {row.state !== 'READ' && (
              <button
                type="button"
                onClick={() => onState(row.id, 'READ')}
                className="px-[14px] h-[32px] rounded-[6px] text-[13px] font-[500] bg-white/5 border border-newTableBorder hover:bg-white/10"
              >
                Mark read
              </button>
            )}
            {row.state !== 'DONE' && (
              <button
                type="button"
                onClick={() => onState(row.id, 'DONE')}
                className="px-[14px] h-[32px] rounded-[6px] text-[13px] font-[500] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
              >
                Mark done
              </button>
            )}
            {row.state === 'DONE' && (
              <button
                type="button"
                onClick={() => onState(row.id, 'NEW')}
                className="px-[14px] h-[32px] rounded-[6px] text-[13px] font-[500] bg-white/5 border border-newTableBorder hover:bg-white/10"
              >
                Reopen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminContactComponent: FC = () => {
  const user = useUser();
  const fetch = useFetch();
  const toaster = useToaster();

  const [state, setState] = useState<'ALL' | State>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(state !== 'ALL' ? { state } : {}),
    ...(search ? { search } : {}),
  });

  const { data, isLoading, mutate } = useSWR<Response>(
    `/admin/contact-messages?${query.toString()}`,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load messages');
      return res.json();
    },
    { refreshInterval: 60000 }
  );

  const onState = useCallback(
    async (id: string, next: State) => {
      await fetch(`/admin/contact-messages/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: next }),
      });
      toaster.show(`Marked ${next.toLowerCase()}`, 'success');
      mutate();
    },
    [fetch, mutate, toaster]
  );

  if (!user?.isSuperAdmin) {
    return (
      <div className="text-textColor p-[20px]">
        This page is for administrators.
      </div>
    );
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / limit)) : 1;

  return (
    <div className="flex flex-col gap-[16px] text-textColor max-w-[1000px] w-full mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px] font-[700] text-white flex items-center gap-[8px]">
            <span>✉️</span> Contact Messages
          </h1>
          <p className="text-[13px] opacity-70 mt-[2px]">
            Everything submitted through the contact form. Also emailed to
            support@hookstep.in — this is the copy that survives if that fails.
          </p>
        </div>

        <div className="flex items-center gap-[8px] bg-newBgColorInner border border-newTableBorder p-[4px] rounded-[10px]">
          <Link
            href="/admin/users"
            className="px-[14px] py-[6px] rounded-[6px] text-[13px] font-[500] text-textColor hover:text-white hover:bg-white/5 transition-all"
          >
            👥 Users &amp; Billing
          </Link>
          <Link
            href="/admin/stats"
            className="px-[14px] py-[6px] rounded-[6px] text-[13px] font-[500] text-textColor hover:text-white hover:bg-white/5 transition-all"
          >
            📊 Social Stats
          </Link>
          <Link
            href="/admin/errors"
            className="px-[14px] py-[6px] rounded-[6px] text-[13px] font-[500] text-textColor hover:text-white hover:bg-white/5 transition-all"
          >
            ⚠️ Error Logs
          </Link>
          <Link
            href="/admin/contact"
            className="px-[14px] py-[6px] rounded-[6px] text-[13px] font-[600] bg-primary text-white"
          >
            ✉️ Contact
          </Link>
        </div>
      </div>

      {data && data.failedCount > 0 && (
        <div className="rounded-[8px] border border-amber-500/30 bg-amber-500/10 px-[14px] py-[10px] text-[13px] text-amber-300">
          {data.failedCount} message{data.failedCount === 1 ? '' : 's'} never
          reached the support inbox. They are listed here — the email is the only
          thing that failed, not the message.
        </div>
      )}

      <div className="flex flex-wrap gap-[12px] items-end bg-newBgColorInner border border-newTableBorder rounded-[8px] p-[12px]">
        <div className="flex flex-col gap-[6px]">
          <div className="text-[12px] opacity-70">Status</div>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value as any);
              setPage(1);
            }}
            className="bg-newBgColorInnerInner border border-newTableBorder rounded-[6px] h-[36px] px-[10px] text-[13px] outline-none"
          >
            <option value="ALL">All</option>
            <option value="NEW">New{data ? ` (${data.newCount})` : ''}</option>
            <option value="READ">Read</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div className="flex flex-col gap-[6px] flex-1 min-w-[220px]">
          <div className="text-[12px] opacity-70">Search</div>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="name, email or message text"
            className="bg-newBgColorInnerInner border border-newTableBorder rounded-[6px] h-[36px] px-[10px] text-[13px] outline-none w-full"
          />
        </div>
      </div>

      {isLoading && !data ? (
        <LoadingComponent />
      ) : !data || data.messages.length === 0 ? (
        <div className="border border-newTableBorder rounded-[8px] bg-newBgColorInner p-[32px] text-center">
          <div className="text-[15px] font-[600] text-white">
            Nothing here yet
          </div>
          <div className="text-[13px] opacity-70 mt-[4px]">
            Messages sent through the contact page will appear here.
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-[13px] opacity-70">
            <span>
              {data.total} message{data.total === 1 ? '' : 's'}
            </span>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="flex flex-col gap-[8px]">
            {data.messages.map((m) => (
              <Row key={m.id} row={m} onState={onState} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-[8px]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-[14px] h-[34px] rounded-[6px] text-[13px] bg-white/5 border border-newTableBorder disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-[14px] h-[34px] rounded-[6px] text-[13px] bg-white/5 border border-newTableBorder disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
