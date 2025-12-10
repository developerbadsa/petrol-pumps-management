// src/components/sections/OurPartners/PartnersMarqueeRow.tsx
'use client';

import {motion} from 'framer-motion';
import {LogoCard, type LogoItem} from '../../../ui/LogoCard';

export type Direction = 'left' | 'right';

type Props = {
  items: LogoItem[];
  direction: Direction;
  durationSec?: number;
  className?: string;
};

export default function PartnersMarqueeRow({
  items,
  direction,
  durationSec = 16, // smaller = faster
  className,
}: Props) {
  // duplicate for seamless loop
  const duplicated = [...items, ...items];
  const xKeyframes =
    direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div
      className={[
        'relative mx-auto inline-block overflow-hidden',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* sizing row: gives width = 4 cards exactly */}
      <div className="flex gap-5 opacity-0 pointer-events-none select-none">
        {items.map((item, index) => (
          <LogoCard key={`sizer-${item.name}-${index}`} {...item} />
        ))}
      </div>

      {/* animated track */}
      <motion.div
        className="absolute top-0 left-0 flex gap-5"
        style={{willChange: 'transform'}}
        animate={{x: xKeyframes}}
        transition={{
          duration: durationSec,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {duplicated.map((item, index) => (
          <LogoCard key={`${item.name}-${index}`} {...item} />
        ))}
      </motion.div>
    </div>
  );
}
