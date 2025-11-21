import { z } from 'zod';

export const codeRegex = /^[A-Za-z0-9]{6,8}$/;

export const createLinkSchema = z.object({
  url: z.string().min(1, 'Target URL is required').url('Enter a valid URL with http or https'),
  code: z
    .string()
    .regex(codeRegex, 'Codes must be 6-8 characters, letters or digits')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

