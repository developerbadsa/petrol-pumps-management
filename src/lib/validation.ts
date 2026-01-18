import { z } from 'zod';

export const bdPhoneRegex = /^(\+?8801|01)\d{9}$/;

export function formatZodErrors(error: z.ZodError) {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'form';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  return errors;
}

export function validationErrorResponse(error: z.ZodError) {
  return {
    message: 'Validation error',
    errors: formatZodErrors(error),
  };
}

export async function parseJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function getString(value: FormDataEntryValue | null) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  return value;
}

export function getFile(value: FormDataEntryValue | null) {
  if (!value || typeof value === 'string') {
    return null;
  }
  return value;
}
