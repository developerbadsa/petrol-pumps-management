export type NoticeRow = {
  id: string;
  sl: number;
  title: string;
  publishDate: string; // keep as string for mock; later use ISO if needed
  href?: string; // optional: view link (pdf/details)
};
