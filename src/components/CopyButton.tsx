'use client';

import { useState } from 'react';

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Unable to copy', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

