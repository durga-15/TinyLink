'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CopyButton } from './CopyButton';
import { formatDate } from '@/lib/utils';

export interface LinkRecord {
  id: string;
  code: string;
  url: string;
  clickCount: number;
  lastClickedAt: string | null;
  createdAt: string;
}

interface LinksTableProps {
  links: LinkRecord[];
  isLoading: boolean;
  error?: string;
  onDelete: (code: string) => Promise<void>;
  search: string;
  onSearch: (value: string) => void;
  baseUrl: string;
}

export function LinksTable({
  links,
  isLoading,
  error,
  onDelete,
  search,
  onSearch,
  baseUrl,
}: LinksTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const handleDelete = async (code: string) => {
    const confirmed = window.confirm('Delete this link? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingCode(code);
    try {
      await onDelete(code);
    } finally {
      setDeletingCode(null);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Links</h2>
          <p className="text-sm text-slate-500">Manage, search, and monitor your short links.</p>
        </div>
        <input
          type="search"
          placeholder="Search by code or URL"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 sm:w-64"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Short code</th>
              <th className="px-3 py-2">Target URL</th>
              <th className="px-3 py-2">Clicks</th>
              <th className="px-3 py-2">Last clicked</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!isLoading && links.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-slate-500">
                  {search ? 'No links match your search.' : 'No links yet. Create your first one above.'}
                </td>
              </tr>
            )}
            {links.map((link) => (
              <tr key={link.id} className="text-slate-700">
                <td className="px-3 py-3 font-mono text-xs uppercase text-indigo-600">{link.code}</td>
                <td className="max-w-sm px-3 py-3">
                  <a
                    href={link.url}
                    className="block truncate text-indigo-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    title={link.url}
                  >
                    {link.url}
                  </a>
                </td>
                <td className="px-3 py-3 font-semibold">{link.clickCount}</td>
                <td className="px-3 py-3 text-slate-500">{formatDate(link.lastClickedAt)}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <CopyButton value={`${baseUrl}/${link.code}`} />
                    <Link
                      href={`/code/${link.code}`}
                      className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Stats
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="rounded-md border border-transparent bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-slate-500" role="status">
          Loading links…
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

