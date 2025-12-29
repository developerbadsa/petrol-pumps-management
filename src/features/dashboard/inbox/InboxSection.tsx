'use client';

import { useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import ReplyModal from './ReplyModal';
import { useInboxMessages, useSendReply, useTrashMessage } from './queries';
import type { InboxMessage } from './types';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

const NAME_GREEN = '#75B551';
const TEXT_DARK = '#133374';
const TEXT_MUTED = '#7B8EA3';

function MessageIcon({ hasUnread }: { hasUnread: boolean }) {
  return (
    <div className="relative grid h-[64px] w-[64px] place-items-center rounded-full bg-gradient-to-br from-sky-200 to-emerald-200 shadow-sm">
      <MessageCircle className="h-8 w-8 text-[#1F3B7A]" />
      {hasUnread ? (
        <span className="absolute right-[8px] top-[8px] h-[12px] w-[12px] rounded-full bg-[#EF4444] ring-2 ring-white" />
      ) : null}
    </div>
  );
}

function RowActions({
  onReply,
  onTrash,
  onToggleDetails,
  showDetails,
  canReply,
  disabled,
}: {
  onReply: () => void;
  onTrash: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
  canReply: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="mt-1 flex items-center gap-2 text-[10px] text-[#6F8093]">
      <button
        type="button"
        onClick={onReply}
        disabled={disabled || !canReply}
        className="hover:text-[#133374] disabled:opacity-60"
        title={!canReply ? 'No sender email available' : undefined}
      >
        Reply
      </button>
      <span className="opacity-60">•</span>
      <button
        type="button"
        onClick={onTrash}
        disabled={disabled}
        className="hover:text-[#E11D48] disabled:opacity-60"
      >
        Trash
      </button>
      <span className="opacity-60">•</span>
      <button
        type="button"
        onClick={onToggleDetails}
        disabled={disabled}
        className="hover:text-[#133374] disabled:opacity-60"
      >
        {showDetails ? 'Hide' : 'Show'} Info
      </button>
    </div>
  );
}

function MessageRow({
  item,
  showDetails,
  onToggleDetails,
  onReply,
  onTrash,
  disabled,
}: {
  item: InboxMessage;
  showDetails: boolean;
  onToggleDetails: () => void;
  onReply: () => void;
  onTrash: () => void;
  disabled?: boolean;
}) {
  const canReply = Boolean(item.senderEmail);

  return (
    <div className="flex items-start justify-between gap-4 py-9">
      <div className="flex min-w-0 items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.avatarUrl}
          alt={item.senderName}
          className="mt-[2px] h-10 w-10 rounded-full object-cover shadow-sm"
        />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold" style={{ color: NAME_GREEN }}>
              {item.senderName}
            </span>

            {!item.isRead ? (
              <span className="h-[6px] w-[6px] rounded-full bg-[#EF4444]" title="Unread" />
            ) : null}

            <span className="truncate text-[11px]" style={{ color: TEXT_MUTED }}>
              {item.previewText}
            </span>
          </div>

          <RowActions
            onReply={onReply}
            onTrash={onTrash}
            onToggleDetails={onToggleDetails}
            showDetails={showDetails}
            canReply={canReply}
            disabled={disabled}
          />

          {showDetails ? (
            <div className="mt-2 space-y-1 text-[11px] text-[#6F8093]">
              {item.senderEmail ? <div>Email: {item.senderEmail}</div> : null}
              {item.senderPhone ? <div>Phone: {item.senderPhone}</div> : null}
              {!item.senderEmail && !item.senderPhone ? <div>No contact info.</div> : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 pt-[3px] text-[10px] text-[#A0AFC5]">{item.dateLabel}</div>
    </div>
  );
}

export default function InboxSection() {
  const q = useInboxMessages();
  const trashM = useTrashMessage();
  const sendM = useSendReply();

  const [active, setActive] = useState<InboxMessage | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<number | null>(null);

  const items = useMemo(() => (q.data ?? []) as InboxMessage[], [q.data]);
  const anyBusy = trashM.isPending || sendM.isPending;
  const hasUnread = items.some((m) => !m.isRead);

  return (
    <section className="pb-10">
      <div className="mx-auto mt-10 flex max-w-[860px] flex-col items-center">
        <span>
          <MessageIcon hasUnread={hasUnread} />
        </span>

        <h2 className="mt-4 text-center text-[22px] font-semibold" style={{ color: TEXT_DARK }}>
          Message
        </h2>

        <div className="mt-8 w-full rounded-[12px] bg-[#FAFBFF] px-10 py-4">
          {q.isLoading ? (
            <div className="py-10 text-center text-[12px]" style={{ color: TEXT_MUTED }}>
              Loading messages...
            </div>
          ) : null}

          {q.isError ? (
            <div className="py-10 text-center text-[12px] text-red-600">
              {(q.error as Error)?.message ?? 'Failed to load messages.'}
            </div>
          ) : null}

          {!q.isLoading && !q.isError && items.length === 0 ? (
            <div className="py-12 text-center text-[12px]" style={{ color: TEXT_MUTED }}>
              No messages found.
            </div>
          ) : null}

          {!q.isError
            ? items.map((m, idx) => {
                const showDetails = detailsId === m.id;

                return (
                  <div key={m.id} className={cx(idx !== 0 && 'border-t border-black/5')}>
                    <MessageRow
                      item={m}
                      showDetails={showDetails}
                      disabled={anyBusy}
                      onToggleDetails={() => setDetailsId((prev) => (prev === m.id ? null : m.id))}
                      onReply={() => {
                        setActive(m);
                        setReplyOpen(true);
                      }}
                      onTrash={() => trashM.mutate(m.id)}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>

      <ReplyModal
        open={replyOpen}
        message={active}
        busy={sendM.isPending}
        onClose={() => setReplyOpen(false)}
        onSend={({ messageId, text }) => {
          const msg = active;
          if (!msg || msg.id !== messageId) return;
          if (!msg.senderEmail) return;

          sendM.mutate(
            {
              to: msg.senderEmail,
              subject: `Re: ${msg.subject}`,
              body:
                `${text}\n\n---\n` +
                `From: ${msg.senderName} (${msg.senderEmail ?? '—'})\n` +
                `Phone: ${msg.senderPhone ?? '—'}\n\n` +
                `${msg.previewText}`,
            },
            {
              onSuccess: () => setReplyOpen(false),
            }
          );
        }}
      />
    </section>
  );
}
