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

  const handleImpersonate = useCallback((userId: string, email: string) => {
    setCookie('impersonate', userId, 365);
    toaster.show(`Impersonating ${email}...`, 'success');
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, [toaster]);

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((u) => {
      const matchesSearch =
        !searchInput ||
        u.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchInput.toLowerCase())) ||
        u.organizations.some((o) =>
          o.organization.name.toLowerCase().includes(searchInput.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (tierFilter === 'ADMIN') return u.isSuperAdmin;
      if (tierFilter === 'PAID') {
        return u.organizations.some((o) => !!o.organization.subscription);
      }
      if (tierFilter === 'TRIAL') {
        return u.organizations.some(
          (o) => o.organization.isTrailing && !o.organization.subscription
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
                            <div className="text-[11px] opacity-60 capitalize">
                              {role.toLowerCase()}
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
                        <button
                          onClick={() => handleImpersonate(u.id, u.email)}
                          className="px-[10px] py-[5px] bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 rounded-[6px] text-[12px] font-[600] transition-all cursor-pointer inline-flex items-center gap-[4px]"
                        >
                          <span>🎭</span> Impersonate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
