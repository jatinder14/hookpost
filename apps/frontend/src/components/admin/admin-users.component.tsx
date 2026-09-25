'use client';

import React, { FC, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import copy from 'copy-to-clipboard';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useUser } from '@hookpost/frontend/components/layout/user.context';
import { useToaster } from '@hookpost/react/toaster/toaster';
import { Button } from '@hookpost/react/form/button';
import { LoadingComponent } from '@hookpost/frontend/components/layout/loading';
import { setCookie } from '@hookpost/frontend/components/layout/layout.context';

dayjs.extend(relativeTime);

interface OrganizationInfo {
  id: string;
  name: string;
  paymentId: string | null;
  allowTrial: boolean;
  isTrailing: boolean;
  createdAt: string;
  subscription: {
    id: string;
    subscriptionTier: string;
    isLifetime: boolean;
    period: string;
    totalChannels: number;
    cancelAt: string | null;
    createdAt: string;
  } | null;
  _count: {
    Integration: number;
    post: number;
  };
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  activated: boolean;
  providerName: string;
  createdAt: string;
  organizations: {
    id: string;
    role: string;
    organization: OrganizationInfo;
  }[];
}

interface UsersApiResponse {
  metrics: {
    totalUsers: number;
    totalOrgs: number;
    totalSubscriptions: number;
    activeTrials: number;
    totalIntegrations: number;
    totalPosts: number;
  };
  users: UserRow[];
}

interface JourneyEvent {
  id: string;
  type: 'SIGNUP' | 'WORKSPACE' | 'CHANNEL' | 'POST' | 'BILLING';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  status?: 'success' | 'warning' | 'info' | 'error';
}

interface UserJourneyResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    isSuperAdmin: boolean;
    activated: boolean;
    providerName: string;
    createdAt: string;
  };
  summary: {
    totalWorkspaces: number;
    totalIntegrations: number;
    totalPosts: number;
    publishedPosts: number;
    hasActiveSubscription: boolean;
    isTrailing: boolean;
  };
  events: JourneyEvent[];
}

const UserJourneyModal: FC<{
  userId: string;
  onClose: () => void;
}> = ({ userId, onClose }) => {
  const fetch = useFetch();
  const { data, error, isLoading } = useSWR<UserJourneyResponse>(
    `/admin/users/${userId}/journey`,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to load user journey');
      }
      return res.json();
    }
  );

  return (
    <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex justify-end animate-fade">
      <div
        className="w-full max-w-[620px] bg-[#0b132b] border-s border-newTableBorder h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-[20px] border-b border-newTableBorder bg-newBgColorInner flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-[700] text-white text-[16px]">
              {data?.user?.email?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-[700] text-white">
                  {data?.user?.email || 'User Journey'}
                </h2>
                {data?.user?.isSuperAdmin && (
                  <span className="px-[6px] py-[1px] text-[10px] font-[700] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                    SUPERADMIN
                  </span>
                )}
              </div>
              <p className="text-[12px] opacity-65">
                {data?.user?.name ? `${data.user.name} • ` : ''}
                Joined {data?.user?.createdAt ? dayjs(data.user.createdAt).format('MMM D, YYYY') : '—'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-[8px] bg-white/5 hover:bg-white/10 flex items-center justify-center text-[16px] text-white transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
              <LoadingComponent height={50} width={50} />
              <div className="text-[13px] opacity-70">Loading user lifecycle journey...</div>
            </div>
          ) : error ? (
            <div className="p-[16px] bg-red-950/30 border border-red-800 rounded-[8px] text-red-300 text-[13px]">
              Failed to load journey: {error.message}
            </div>
          ) : data ? (
            <>
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-4 gap-[10px]">
                <div className="border border-newTableBorder bg-newBgColorInner rounded-[10px] p-[12px] text-center">
                  <div className="text-[11px] opacity-60">Workspaces</div>
                  <div className="text-[18px] font-[700] text-white mt-[2px]">
                    {data.summary.totalWorkspaces}
                  </div>
                </div>
                <div className="border border-newTableBorder bg-newBgColorInner rounded-[10px] p-[12px] text-center">
                  <div className="text-[11px] opacity-60">Channels</div>
                  <div className="text-[18px] font-[700] text-sky-400 mt-[2px]">
                    {data.summary.totalIntegrations}
                  </div>
                </div>
                <div className="border border-newTableBorder bg-newBgColorInner rounded-[10px] p-[12px] text-center">
                  <div className="text-[11px] opacity-60">Posts</div>
                  <div className="text-[18px] font-[700] text-emerald-400 mt-[2px]">
                    {data.summary.totalPosts}
                  </div>
                  <div className="text-[9px] opacity-50">{data.summary.publishedPosts} published</div>
                </div>
                <div className="border border-newTableBorder bg-newBgColorInner rounded-[10px] p-[12px] text-center">
                  <div className="text-[11px] opacity-60">Billing</div>
                  <div className="text-[12px] font-[700] mt-[4px]">
                    {data.summary.hasActiveSubscription ? (
                      <span className="text-emerald-300">Paid Plan</span>
                    ) : data.summary.isTrailing ? (
                      <span className="text-amber-300">Free Trial</span>
                    ) : (
                      <span className="opacity-70">Free Tier</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chronological Timeline */}
              <div>
                <h3 className="text-[13px] uppercase tracking-wider font-[700] opacity-75 mb-[14px] flex items-center gap-[6px]">
                  <span>🧭</span> Activity & Lifecycle Timeline ({data.events.length} events)
                </h3>

                {data.events.length === 0 ? (
                  <div className="text-center py-[40px] opacity-50 border border-newTableBorder rounded-[10px] bg-newBgColorInner text-[13px]">
                    No activity recorded yet for this account.
                  </div>
                ) : (
                  <div className="relative border-s-2 border-newTableBorder ms-[16px] flex flex-col gap-[16px] py-[6px]">
                    {data.events.map((evt) => {
                      const icon =
                        evt.type === 'SIGNUP'
                          ? '🚀'
                          : evt.type === 'WORKSPACE'
                          ? '🏢'
                          : evt.type === 'CHANNEL'
                          ? '🔗'
                          : evt.type === 'POST'
                          ? '📝'
                          : '💳';

                      const dotBg =
                        evt.status === 'success'
                          ? 'bg-emerald-500 ring-emerald-500/20'
                          : evt.status === 'error'
                          ? 'bg-rose-500 ring-rose-500/20'
                          : evt.status === 'warning'
                          ? 'bg-amber-500 ring-amber-500/20'
                          : 'bg-indigo-500 ring-indigo-500/20';

                      return (
                        <div key={evt.id} className="relative ps-[24px]">
                          {/* Dot on timeline */}
                          <div
                            className={`absolute -start-[7px] top-[14px] w-[12px] h-[12px] rounded-full ring-4 ${dotBg}`}
                          />

                          {/* Event Card */}
                          <div className="border border-newTableBorder rounded-[10px] p-[14px] bg-newBgColorInner hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between gap-[8px]">
                              <div className="flex items-center gap-[6px] font-[600] text-white text-[13px]">
                                <span>{icon}</span>
                                <span>{evt.title}</span>
                              </div>
                              <span className="text-[11px] opacity-60 whitespace-nowrap">
                                {dayjs(evt.timestamp).fromNow()}
                              </span>
                            </div>

                            <p className="text-[12px] opacity-80 mt-[6px] leading-[18px]">
                              {evt.description}
                            </p>

                            <div className="flex items-center justify-between gap-[8px] mt-[10px] pt-[8px] border-t border-newTableBorder/50 text-[11px] opacity-60">
                              <span>{dayjs(evt.timestamp).format('MMM D, YYYY • h:mm A')}</span>
                              {evt.status && (
                                <span className={`capitalize font-[600] ${
                                  evt.status === 'success'
                                    ? 'text-emerald-400'
                                    : evt.status === 'error'
                                    ? 'text-rose-400'
                                    : evt.status === 'warning'
                                    ? 'text-amber-400'
                                    : 'text-indigo-400'
                                }`}>
                                  {evt.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const MetricCard: FC<{
  title: string;
  value: number;
  icon: string;
  subtext?: string;
  color?: string;
}> = ({ title, value, icon, subtext, color }) => (
  <div className="border border-newTableBorder rounded-[12px] p-[16px] bg-newBgColorInner flex flex-col justify-between shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-[13px] opacity-75 font-medium">{title}</div>
      <div className="text-[20px]">{icon}</div>
    </div>
    <div className="mt-[8px]">
      <div className={`text-[28px] font-[700] ${color || 'text-white'}`}>
        {value.toLocaleString()}
      </div>
      {subtext && <div className="text-[11px] opacity-60 mt-[2px]">{subtext}</div>}
    </div>
  </div>
);

export const AdminUsersComponent: FC = () => {
  const user = useUser();
  const fetch = useFetch();
  const toaster = useToaster();
  const [searchInput, setSearchInput] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'PAID' | 'TRIAL' | 'ADMIN'>('ALL');
  const [selectedJourneyUserId, setSelectedJourneyUserId] = useState<string | null>(null);
  const [togglingAdminId, setTogglingAdminId] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR<UsersApiResponse>(
    '/admin/users',
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to load admin users');
      }
      return res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleCopy = useCallback((text: string, label: string) => {
    copy(text);
    toaster.show(`${label} copied to clipboard`, 'success');
  }, [toaster]);

  // The cookie must hold the UserOrganization id: auth.middleware resolves it
  // with getUserOrg(). This used to pass the user id, which matches nothing -
  // the banner said "Currently Impersonating" while every page still showed
  // the admin's own workspace and channels.
  const handleImpersonate = useCallback((userOrgId: string, email: string) => {
    if (!userOrgId) return;
    setCookie('impersonate', userOrgId, 365);
    toaster.show(`Impersonating ${email}...`, 'success');
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, [toaster]);

  const handleToggleSuperAdmin = useCallback(
    async (targetUserId: string, nextState: boolean, email: string) => {
      if (targetUserId === user?.id && !nextState) {
        toaster.show('You cannot revoke your own Super Admin access', 'warning');
        return;
      }

      const confirmMsg = nextState
        ? `Are you sure you want to grant Super Admin access to ${email}? They will have full administrative privileges.`
        : `Are you sure you want to revoke Super Admin access from ${email}?`;

      if (!window.confirm(confirmMsg)) return;

      setTogglingAdminId(targetUserId);
      try {
        const res = await fetch(`/admin/users/${targetUserId}/super-admin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isSuperAdmin: nextState }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to update admin permissions');
        }
        toaster.show(
          `Super Admin ${nextState ? 'granted to' : 'revoked from'} ${email}`,
          'success'
        );
        mutate();
      } catch (e: any) {
        toaster.show(e.message || 'Operation failed', 'warning');
      } finally {
        setTogglingAdminId(null);
      }
    },
    [user, fetch, toaster, mutate]
  );

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((u) => {
      const matchesSearch =
        !searchInput ||
        u.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchInput.toLowerCase())) ||
        u.organizations?.some((o) =>
          o.organization?.name?.toLowerCase().includes(searchInput.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (tierFilter === 'ADMIN') return u.isSuperAdmin;
      if (tierFilter === 'PAID') {
        return u.organizations?.some((o) => !!o.organization?.subscription);
      }
      if (tierFilter === 'TRIAL') {
        return u.organizations?.some(
          (o) => o.organization?.isTrailing && !o.organization?.subscription
        );
      }

      return true;
    });
  }, [data, searchInput, tierFilter]);

  if (!user?.isSuperAdmin) {
    return (
      <div className="border border-newTableBorder rounded-[8px] p-[24px] text-center opacity-70">
        You are not authorized to view the Super Admin panel.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px] max-w-[1400px] w-full mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px] font-[700] text-white flex items-center gap-[8px]">
            <span>🛡️</span> Super Admin Portal
          </h1>
          <p className="text-[13px] opacity-70 mt-[2px]">
            Master view of all registered users, workspaces, Razorpay billing records, and system activity.
          </p>
        </div>

        <div className="flex items-center gap-[8px] bg-newBgColorInner border border-newTableBorder p-[4px] rounded-[10px]">
          <Link
            href="/admin/users"
            className="px-[14px] py-[6px] rounded-[6px] text-[13px] font-[600] bg-primary text-white"
          >
            👥 Users & Billing
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
            className="px-[14px] py-[6px] rounded-[6px] text-[13px] font-[500] text-textColor hover:text-white hover:bg-white/5 transition-all"
          >
            ✉️ Contact
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      {data?.metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[14px]">
          <MetricCard
            title="Total Users"
            value={data.metrics.totalUsers}
            icon="👥"
            subtext="Registered accounts"
          />
          <MetricCard
            title="Workspaces"
            value={data.metrics.totalOrgs}
            icon="🏢"
            subtext="Active organizations"
          />
          <MetricCard
            title="Paid / Lifetime"
            value={data.metrics.totalSubscriptions}
            icon="💎"
            color="text-emerald-400"
            subtext="Paying & lifetime tiers"
          />
          <MetricCard
            title="Active Free Trials"
            value={data.metrics.activeTrials}
            icon="⏳"
            color="text-amber-400"
            subtext="In onboarding trial"
          />
          <MetricCard
            title="Connected Channels"
            value={data.metrics.totalIntegrations}
            icon="🔗"
            subtext="Active social channels"
          />
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-[12px] items-center justify-between bg-newBgColorInner border border-newTableBorder rounded-[12px] p-[14px]">
        <div className="flex flex-wrap items-center gap-[10px] flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email, name, or workspace..."
              className="bg-[#0f172a] h-[40px] border border-newTableBorder rounded-[8px] px-[12px] text-[14px] text-textColor w-full focus:outline-none focus:border-primary transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-[10px] top-[10px] text-[12px] opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-[6px]">
            {(['ALL', 'TRIAL', 'PAID', 'ADMIN'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTierFilter(filter)}
                className={`px-[12px] h-[38px] rounded-[8px] text-[12px] font-[600] transition-all ${
                  tierFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-[#0f172a] border border-newTableBorder text-textColor hover:bg-white/5'
                }`}
              >
                {filter === 'ALL' && 'All Users'}
                {filter === 'TRIAL' && '⏳ Free Trial'}
                {filter === 'PAID' && '💎 Paid / Lifetime'}
                {filter === 'ADMIN' && '🛡️ Admins'}
              </button>
            ))}
          </div>
        </div>

        <Button secondary onClick={() => mutate()}>
          🔄 Refresh
        </Button>
      </div>

      {/* Main Users Table */}
      {isLoading ? (
        <LoadingComponent />
      ) : error ? (
        <div className="text-red-400 p-[20px] bg-red-950/20 border border-red-800 rounded-[8px]">
          Failed to load users: {error.message}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="border border-newTableBorder rounded-[12px] p-[36px] text-center opacity-70 bg-newBgColorInner">
          No users matching your filters.
        </div>
      ) : (
        <div className="border border-newTableBorder rounded-[12px] overflow-hidden bg-newBgColorInner shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b132b]/60 text-[12px] uppercase opacity-75 border-b border-newTableBorder tracking-wider">
                  <th className="py-[12px] px-[16px]">User & Identity</th>
                  <th className="py-[12px] px-[16px]">Workspace & Role</th>
                  <th className="py-[12px] px-[16px]">Joined</th>
                  <th className="py-[12px] px-[16px]">Razorpay Customer / Sub ID</th>
                  <th className="py-[12px] px-[16px]">Subscription Plan</th>
                  <th className="py-[12px] px-[16px] text-center">Channels</th>
                  <th className="py-[12px] px-[16px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-newTableBorder text-[13px]">
                {filteredUsers.map((u) => {
                  const mainOrg = u.organizations[0]?.organization;
                  const role = u.organizations[0]?.role || 'MEMBER';
                  const sub = mainOrg?.subscription;
                  const paymentId = mainOrg?.paymentId;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User */}
                      <td className="py-[14px] px-[16px]">
                        <div className="flex items-center gap-[10px]">
                          <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-[700] text-white text-[14px] flex-shrink-0">
                            {u.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-[600] text-white flex items-center gap-[6px]">
                              <span>{u.email}</span>
                              {u.isSuperAdmin && (
                                <span className="px-[6px] py-[1px] text-[10px] font-[700] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                                  SUPERADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] opacity-60 flex items-center gap-[4px] mt-[1px]">
                              {u.name ? `${u.name} • ` : ''}
                              <span className="font-mono">{u.id.split('-').at(-1)}</span>
                              <span>• {u.providerName}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Org */}
                      <td className="py-[14px] px-[16px]">
                        {mainOrg ? (
                          <div>
                            <div className="font-[600] text-white">
                              {mainOrg.name}
                            </div>
                            <div className="text-[11px] opacity-60">
                              {/* Workspace role, not platform role. Every
                                  signup owns its own workspace, so this read
                                  "Superadmin" for all 18 users - the platform
                                  super admins are the amber badge above. */}
                              {role === 'SUPERADMIN'
                                ? 'Owner'
                                : role === 'ADMIN'
                                ? 'Admin'
                                : 'Member'}
                            </div>
                          </div>
                        ) : (
                          <span className="opacity-40">—</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-[14px] px-[16px] whitespace-nowrap">
                        <div className="text-white">
                          {dayjs(u.createdAt).format('MMM D, YYYY')}
                        </div>
                        <div className="text-[11px] opacity-60">
                          {dayjs(u.createdAt).fromNow()}
                        </div>
                      </td>

                      {/* Razorpay Payment ID */}
                      <td className="py-[14px] px-[16px]">
                        {paymentId ? (
                          <div className="flex items-center gap-[6px]">
                            <code className="px-[6px] py-[2px] bg-[#0f172a] border border-newTableBorder rounded text-[11px] font-mono text-emerald-300">
                              {paymentId}
                            </code>
                            <button
                              onClick={() => handleCopy(paymentId, 'Razorpay Customer / Sub ID')}
                              className="text-[12px] opacity-60 hover:opacity-100 cursor-pointer"
                              title="Copy Razorpay ID"
                            >
                              📋
                            </button>
                          </div>
                        ) : (
                          <span className="text-[12px] opacity-40">No Razorpay ID</span>
                        )}
                      </td>

                      {/* Subscription Tier */}
                      <td className="py-[14px] px-[16px]">
                        {sub ? (
                          <div className="flex flex-col gap-[2px]">
                            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[11px] font-[700] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-max">
                              💎 {sub.subscriptionTier}
                              {sub.isLifetime ? ' (LIFETIME)' : ` (${sub.period})`}
                            </span>
                            <span className="text-[10px] opacity-60">
                              {sub.totalChannels} Channels allowed
                            </span>
                          </div>
                        ) : mainOrg?.isTrailing ? (
                          <div className="flex flex-col gap-[2px]">
                            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[11px] font-[700] bg-amber-500/20 text-amber-300 border border-amber-500/40 w-max">
                              ⏳ FREE TRIAL
                            </span>
                            <span className="text-[10px] opacity-60">Trial Active</span>
                          </div>
                        ) : (
                          <span className="px-[8px] py-[2px] rounded-full text-[11px] font-[600] bg-white/10 text-white/70 w-max">
                            FREE
                          </span>
                        )}
                      </td>

                      {/* Channels & Posts Count */}
                      <td className="py-[14px] px-[16px] text-center">
                        <div className="font-[600] text-white">
                          {mainOrg?._count?.Integration || 0}
                        </div>
                        <div className="text-[10px] opacity-60">
                          {mainOrg?._count?.post || 0} posts
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-[14px] px-[16px] text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-[6px]">
                          <button
                            onClick={() => setSelectedJourneyUserId(u.id)}
                            className="px-[10px] py-[5px] bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 rounded-[6px] text-[12px] font-[600] transition-all cursor-pointer inline-flex items-center gap-[4px]"
                            title="View full lifecycle journey"
                          >
                            <span>🧭</span> Journey
                          </button>

                          <button
                            onClick={() => handleToggleSuperAdmin(u.id, !u.isSuperAdmin, u.email)}
                            disabled={togglingAdminId === u.id || (u.id === user?.id && u.isSuperAdmin)}
                            className={`px-[10px] py-[5px] rounded-[6px] text-[12px] font-[600] transition-all cursor-pointer inline-flex items-center gap-[4px] border ${
                              u.isSuperAdmin
                                ? 'bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border-amber-500/40 disabled:opacity-40 disabled:cursor-not-allowed'
                                : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/20'
                            }`}
                            title={
                              u.id === user?.id && u.isSuperAdmin
                                ? 'Cannot revoke own super admin'
                                : u.isSuperAdmin
                                ? 'Revoke Super Admin Access'
                                : 'Grant Super Admin Access'
                            }
                          >
                            <span>🛡️</span> {u.isSuperAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </button>

                          <button
                            onClick={() => handleImpersonate(u.organizations[0]?.id, u.email)}
                            className="px-[10px] py-[5px] bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 rounded-[6px] text-[12px] font-[600] transition-all cursor-pointer inline-flex items-center gap-[4px]"
                          >
                            <span>🎭</span> Impersonate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedJourneyUserId && (
        <UserJourneyModal
          userId={selectedJourneyUserId}
          onClose={() => setSelectedJourneyUserId(null)}
        />
      )}
    </div>
  );
};
