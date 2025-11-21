'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { CreateLinkInput } from '@/lib/validators';
import { createLinkSchema } from '@/lib/validators';

interface LinkFormProps {
  onCreate: (payload: CreateLinkInput) => Promise<{ error?: string }>;
}

export function LinkForm({ onCreate }: LinkFormProps) {
  const [serverMessage, setServerMessage] = useState<{ type: 'error' | 'success'; text: string }>();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { url: '', code: '' },
  });

  const onSubmit = async (values: CreateLinkInput) => {
    setServerMessage(undefined);
    const result = await onCreate(values);

    if (result.error) {
      setServerMessage({ type: 'error', text: result.error });
      return;
    }

    reset();
    setServerMessage({ type: 'success', text: 'Link created successfully' });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-700">
          Target URL
        </label>
        <input
          id="url"
          type="url"
          placeholder="https://example.com/product"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          {...register('url')}
        />
        {errors.url && <p className="mt-1 text-sm text-rose-600">{errors.url.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="code" className="block text-sm font-medium text-slate-700">
            Custom code (optional)
          </label>
          <span className="text-xs text-slate-500">Must be 6-8 letters or digits</span>
        </div>
        <input
          id="code"
          type="text"
          placeholder="docs123"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          {...register('code')}
        />
        {errors.code && <p className="mt-1 text-sm text-rose-600">{errors.code.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Create short link'}
      </button>

      {serverMessage && (
        <p
          role="status"
          className={`text-sm ${
            serverMessage.type === 'error' ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {serverMessage.text}
        </p>
      )}
    </form>
  );
}

