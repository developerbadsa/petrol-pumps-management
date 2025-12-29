import type { InboxMessage } from './types';

type ContactMessageApi = {
  id: number;
  sender_name: string;
  sender_email?: string | null;
  sender_phone?: string | null;
  subject?: string | null;
  message?: string | null;
  is_read?: boolean | number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function avatarUrlFor(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=128&background=E2E8F0&color=0F172A`;
}

function formatDateLabel(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function buildPreview(subject?: string | null, message?: string | null) {
  const s = (subject ?? '').trim();
  const m = (message ?? '').trim();
  if (s && m) return `${s}: ${m}`;
  return s || m || '';
}

function normalizeList(raw: any): ContactMessageApi[] {
  if (Array.isArray(raw)) return raw as ContactMessageApi[];
  if (Array.isArray(raw?.data)) return raw.data as ContactMessageApi[];
  return [];
}

async function readJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message ?? res.statusText ?? 'Request failed';
    throw new Error(msg);
  }

  return data;
}

export const inboxRepo = {
  async list(): Promise<InboxMessage[]> {
    const res = await fetch('/api/contact-messages', {
      cache: 'no-store',
      credentials: 'include',
    });

    const raw = await readJsonOrThrow(res);
    const list = normalizeList(raw);

    return list.map((m) => {
      const senderName = m.sender_name ?? 'Unknown';
      const subject = (m.subject ?? '').trim();
      const message = (m.message ?? '').trim();

      return {
        id: m.id,
        senderName,
        senderEmail: m.sender_email ?? null,
        senderPhone: m.sender_phone ?? null,
        subject,
        message,
        isRead: Boolean(m.is_read),
        createdAt: m.created_at ?? null,
        previewText: buildPreview(subject, message),
        dateLabel: formatDateLabel(m.created_at),
        avatarUrl: avatarUrlFor(senderName),
      };
    });
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`/api/contact-messages/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    await readJsonOrThrow(res);
  },
};
