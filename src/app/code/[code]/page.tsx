import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CopyButton } from '@/components/CopyButton';
import { prisma } from '@/lib/prisma';
import { appConfig } from '@/lib/env';
import { formatDate } from '@/lib/utils';

interface LinkStatsPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: LinkStatsPageProps) {
  const { code } = await params;
  return {
    title: `Stats for ${code} · TinyLink`,
  };
}

export default async function LinkStatsPage({ params }: LinkStatsPageProps) {
  const { code } = await params;
  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    notFound();
  }

  const shortUrl = `${appConfig.siteUrl}/${link.code}`;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to dashboard
      </Link>

      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-slate-500">Short code</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-slate-900 px-3 py-1 font-mono text-sm uppercase text-white">
            {link.code}
          </span>
          <CopyButton value={shortUrl} />
        </div>
        <p className="text-sm text-slate-500">{shortUrl}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <dl className="grid grid-cols-1 divide-y divide-slate-100 text-sm sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="p-4">
            <dt className="text-slate-500">Target URL</dt>
            <dd className="mt-1 truncate text-indigo-600">
              <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
                {link.url}
              </a>
            </dd>
          </div>
          <div className="p-4">
            <dt className="text-slate-500">Created</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatDate(link.createdAt)}</dd>
          </div>
          <div className="p-4">
            <dt className="text-slate-500">Total clicks</dt>
            <dd className="mt-1 text-3xl font-bold text-slate-900">{link.clickCount}</dd>
          </div>
          <div className="p-4">
            <dt className="text-slate-500">Last clicked</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatDate(link.lastClickedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

