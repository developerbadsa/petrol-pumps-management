'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import AlbumCard, {type AlbumCardData} from './Card';

type GridCardSectionProps = {
  sectionCardData: AlbumCardData[];
  columnPerRow?: string;
  title: string;
  description?: string;
};

export default function GridCardSection({
  sectionCardData,
  columnPerRow = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  title,
  description,
}: GridCardSectionProps) {
  return (
    <section className="relative bg-[linear-gradient(180deg,#F6FCF7_0%,#EDF8F1_100%)] pb-16 pt-10 md:pb-24 md:pt-14">
      <div className="lpg-container relative space-y-8 md:space-y-10">
        <div className="text-center">
          <SectionHeading title={title} />
          {description ? (
            <p className="mt-2 text-[13px] text-[#5A6B7B] md:text-[14px]">
              {description}
            </p>
          ) : null}
        </div>

        <div className={columnPerRow}>
          {sectionCardData.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </section>
  );
}
