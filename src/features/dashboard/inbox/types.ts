export type InboxMessage = {
  id: number;

  senderName: string;
  senderEmail?: string | null;
  senderPhone?: string | null;

  subject: string;
  message: string;

  isRead: boolean;
  createdAt?: string | null;

  // UI helpers
  previewText: string; // subject + message combined
  dateLabel: string; // formatted date
  avatarUrl: string;
};
