export type BannerApiRow = {
  id: number;
  title?: string | null;
  image?: string | null; // usually "/storage/..."
  type?: string | null;
};

export type BannerItem = {
  id: number;
  title?: string;
  imageSrc: string; // always string URL (absolute)
  type?: string;
};
