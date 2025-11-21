'use client';

import { useState } from 'react';
import useSWR from 'swr';

import { LinkForm } from './LinkForm';
import { type LinkRecord, LinksTable } from './LinksTable';
import type { CreateLinkInput } from '@/lib/validators';

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to load links');
  }
  return response.json();
};

export function LinkManager() {
  const [search, setSearch] = useState('');
  const query = search ? `?search=${encodeURIComponent(search)}` : '';

  const { data, error, isLoading, mutate } = useSWR<{ links: LinkRecord[] }>(
    `/api/links${query}`,
    fetcher,
    {
      refreshInterval: 5000,
    },
  );

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const handleCreate = async (payload: CreateLinkInput) => {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        error:
          typeof data.error === 'string'
            ? data.error
            : 'Unable to create link. Please try again.',
      };
    }

    await mutate();
    return {};
  };

  const handleDelete = async (code: string) => {
    const response = await fetch(`/api/links/${code}`, { method: 'DELETE' });
    if (!response.ok && response.status !== 404) {
      throw new Error('Unable to delete link');
    }
    await mutate();
  };

  return (
    <div className="space-y-6">
      <LinkForm onCreate={handleCreate} />
      <LinksTable
        links={data?.links ?? []}
        isLoading={isLoading}
        error={error?.message}
        onDelete={handleDelete}
        search={search}
        onSearch={setSearch}
        baseUrl={origin}
      />
    </div>
  );
}

