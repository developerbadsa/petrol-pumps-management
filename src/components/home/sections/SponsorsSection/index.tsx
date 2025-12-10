'use client';

import Image, { type StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

import leaderImg1 from '@/assets/leader-img/md-serajul-mawla.png';
import leaderImg2 from '@/assets/leader-img/hasin-parfez.png';
import folio1 from '@/assets/Bento_Grid (7).png';
import folio2 from '@/assets/Bento_Grid (8).png';
import sponserImg1 from '@/assets/sponser-img/mgi.png';
import arrowuiIcon from '@/assets/ui-icons/Layer_1 (3).png';
import SectionHeading from '@components/ui/SectionHeading';

type Sponsor = {
  name: string;
  logo: StaticImageData | string;
};

type Leader = {
  name: string;
  title: string;
  lines: string[];
  bio: string;
  photo: StaticImageData;
};

type Direction = 'left' | 'right';

const sponsors: Sponsor[] = [
  { name: 'MGI', logo: sponserImg1 },
  { name: 'Laugfs Gas', logo: sponserImg1 },
  { name: 'Promita LPG', logo: sponserImg1 },
  { name: 'Total', logo: sponserImg1 },
  { name: 'Omera', logo: sponserImg1 },
  { name: 'Navana LPG', logo: sponserImg1 },
  { name: 'JMI Gas', logo: sponserImg1 },
  { name: 'Beximco LPG', logo: sponserImg1 },
  { name: 'Petromax LPG', logo: sponserImg1 },
  { name: 'Universal Gas', logo: sponserImg1 },
  { name: 'Universal Gas1', logo: sponserImg1 },
];

const leaders: Leader[] = [
  {
    name: 'Mohammad Serajul Mawla',
    title: 'PRESIDENT',
    lines: [
      'Mechanical Engineer, BUET',
      'Managing Director, Saad Motors Ltd.',
      'Managing Director, SMT Energy Ltd.',
    ],
    bio: `Liquefied Petroleum Gas (Autogas) has gained global popularity 
as an alternative clean fuel. Bangladesh has also adopted this fuel 
to reduce emissions and reliance on traditional energy sources. 
Our association works to ensure safe and efficient autogas usage 
across the country, supporting members through policy, training 
and technical guidance.`,
    photo: leaderImg1,
  },
  {
    name: 'Md. Hasin Parvez',
    title: 'GENERAL SECRETARY',
    lines: [
      'CEO, Green Fuel Technologies Ltd.',
      'Prop. Green Fuel CNG & LPG Conversion Center',
      'Managing Director at Green Distribution Energy Services Ltd.',
    ],
    bio: `LPG is a clean-burning and cost-effective energy value and 
environment friendly. The association helps members to maintain 
highest safety standards, technical excellence and regulatory 
compliance while expanding autogas services across Bangladesh.`,
    photo: leaderImg2,
  },
];

// ---------------- Marquee Row (Framer Motion) ----------------
// ---------------- Marquee Row (Framer Motion) ----------------

type FramerMarqueeRowProps = {
  items: Sponsor[];
  direction: Direction;
  durationSec?: number;
  className?: string;
};

function FramerMarqueeRow({
  items,
  direction,
  durationSec = 8,
  className,
}: FramerMarqueeRowProps) {
  const offset = 32; // how far each row moves in px

  const xKeyframes =
    direction === 'left'
      ? [0, -offset, 0]
      : [0, offset, 0];

  return (
    <div
      className={['relative mx-auto inline-block overflow-hidden', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <motion.div
        className="flex justify-center gap-4"
        style={{ willChange: 'transform' }}
        animate={{ x: xKeyframes }}
        transition={{
          duration: durationSec,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {items.map((sponsor) => (
          <div
            key={sponsor.name}
            className="flex h-[50px] min-w-[130px] items-center justify-center rounded-[12px] bg-white px-6 shadow-[0_18px_32px_rgba(0,0,0,0.12)]"
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={100}
              height={32}
              className="object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}


// ---------------- Main Section ----------------

export default function SponsorsSection() {
const sponsorRows: { items: Sponsor[]; direction: Direction; durationSec: number }[] = [
  {
    // 1st row → 2 logos (index 0–1)
    direction: 'right',
    items: sponsors.slice(0, 2),
    durationSec: 20,
  },
  {
    // 2nd row → 4 logos (index 2–5)
    direction: 'left',
    items: sponsors.slice(2, 6),
    durationSec: 24,
  },
  {
    // 3rd row → 5 logos (index 6–10)
    direction: 'right',
    items: sponsors.slice(6, 11),
    durationSec: 22,
  },
];


  return (
    <section className="relative z-0 pb-20 pt-12">
      {/* top green line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4" />

      <div className="relative flex flex-col gap-44">
        {/* sponsors title + marquee */}
        <div className="relative flex w-full flex-col items-center text-center">
          {/* side leaves */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[330px] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]" />
            <Image src={folio1} alt="" fill className="object-contain" />
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[330px] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#75B5534d,_transparent_70%)]" />
            <Image src={folio2} alt="" fill className="object-contain" />
          </div>

          <div className="lpg-container">
            <SectionHeading
              title=" SPONSORS"
              subtitle=" Lorem ipsum dolor sit amet consectetur. Ultrices volutpat sollicitudin quis at in. In urna fermentum nunc sapien tortor."
            />

            <div className="mt-7 flex flex-col items-center gap-4">
              {sponsorRows.map((row, rowIndex) => (
                <FramerMarqueeRow
                  key={rowIndex}
                  items={row.items}
                  direction={row.direction}
                  durationSec={row.durationSec}
                  className={rowIndex > 0 ? 'mt-1' : ''}
                />
              ))}
            </div>
          </div>
        </div>









        {/* leaders cards */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 -top-1/2 left-0 hidden w-[330px] opacity-10 lg:block">
            <Image src={arrowuiIcon} alt="" fill className="object-contain" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 -top-1/2 right-0 hidden w-[330px] -scale-x-100 transform opacity-10 lg:block">
            <Image src={arrowuiIcon} alt="" fill className="object-contain" />
          </div>

          <div className="lpg-container relative mt-24 grid items-center justify-center gap-6 lg:grid-cols-2">
            {leaders.map((leader) => (
              <article
                key={leader.name}
                className="relative h-[620px] w-[480px] place-self-center overflow-visible rounded-t-[98px] rounded-b-[12px] border-[4px] border-[#CCD2F4] bg-white/95 px-6 pb-7 pt-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
              >
                {/* photo circle */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
                  <div className="flex h-[270px] w-[270px] items-center justify-center rounded-full bg-[#CCD2F4] p-[4px]">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                      <Image
                        src={leader.photo}
                        alt={leader.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-38 text-center">
                  <h3 className="text-[24px] font-extrabold uppercase">
                    {leader.title}
                  </h3>
                  <p className="mt-1 text-[20px] font-medium">
                    {leader.name}
                  </p>

                  <div className="mt-2 space-y-2 text-[15px] font-light">
                    {leader.lines.map((line) => (
                      <div className="font-light opacity-80" key={line}>
                        {line}
                      </div>
                    ))}
                  </div>

                  <p className="mt-20 text-[15px] leading-relaxed opacity-80">
                    {leader.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
