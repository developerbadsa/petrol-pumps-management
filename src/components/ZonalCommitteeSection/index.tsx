'use client';

import {useMemo, useState} from 'react';
import type {StaticImageData} from 'next/image';
import CommitteeMemberCard from '../shared/CentralCommitteeSection/CommitteeMemberCard';

// demo images (replace with real zonal members)
import leaderImg1 from '@assets/leader-img/md-serajul-mawla.png';
import leaderImg2 from '@assets/leader-img/hasin-parfez.png';

type SocialKind = 'facebook' | 'twitter' | 'linkedin' | 'globe';

export type CommitteeMember = {
  id: string;
  role: string;
  name: string;
  descriptionLines: string[];
  photo: StaticImageData;
  socials: {kind: SocialKind; href: string}[];
};

type ZoneId =
  | 'dhaka-south'
  | 'rangpur'
  | 'khulna'
  | 'mymensingh'
  | 'chittagong'
  | 'padma'
  | 'dhaka-north'
  | 'barishal'
  | 'comilla';

const ZONES: {id: ZoneId; label: string}[] = [
  {id: 'dhaka-south', label: 'DHAKA SOUTH'},
  {id: 'rangpur', label: 'RANGPUR'},
  {id: 'khulna', label: 'KHULNA'},
  {id: 'mymensingh', label: 'MYMENSINGH'},
  {id: 'chittagong', label: 'CHITTAGONG'},
  {id: 'padma', label: 'PADMA'},
  // extra (your screenshot says 11 total)
  {id: 'dhaka-north', label: 'DHAKA NORTH'},
  {id: 'barishal', label: 'BARISHAL'},
  {id: 'comilla', label: 'COMILLA'},
];

// Replace with real data per zone
const ZONAL_MEMBERS: Record<ZoneId, CommitteeMember[]> = {
  'dhaka-south': [
    {
      id: 'ds-1',
      role: 'PRESIDENT',
      name: 'ENGR. MOHAMMAD SERAJUL MAWLA',
      descriptionLines: ['Managing Director, Saad Motors Ltd.'],
      photo: leaderImg1,
      socials: [
        {kind: 'facebook', href: '#'},
        {kind: 'twitter', href: '#'},
        {kind: 'linkedin', href: '#'},
        {kind: 'globe', href: '#'},
      ],
    },
    {
      id: 'ds-2',
      role: 'GENERAL SECRETARY',
      name: 'MD. HASIN PARVEZ',
      descriptionLines: ['CEO, Green Fuel Technologies Ltd.'],
      photo: leaderImg2,
      socials: [
        {kind: 'facebook', href: '#'},
        {kind: 'twitter', href: '#'},
        {kind: 'linkedin', href: '#'},
        {kind: 'globe', href: '#'},
      ],
    },
        {
      id: 'ds-2',
      role: 'GENERAL SECRETARY',
      name: 'MD. HASIN PARVEZ',
      descriptionLines: ['CEO, Green Fuel Technologies Ltd.'],
      photo: leaderImg2,
      socials: [
        {kind: 'facebook', href: '#'},
        {kind: 'twitter', href: '#'},
        {kind: 'linkedin', href: '#'},
        {kind: 'globe', href: '#'},
      ],
    },
        {
      id: 'ds-2',
      role: 'GENERAL SECRETARY',
      name: 'MD. HASIN PARVEZ',
      descriptionLines: ['CEO, Green Fuel Technologies Ltd.'],
      photo: leaderImg2,
      socials: [
        {kind: 'facebook', href: '#'},
        {kind: 'twitter', href: '#'},
        {kind: 'linkedin', href: '#'},
        {kind: 'globe', href: '#'},
      ],
    },
        {
      id: 'ds-2',
      role: 'GENERAL SECRETARY',
      name: 'MD. HASIN PARVEZ',
      descriptionLines: ['CEO, Green Fuel Technologies Ltd.'],
      photo: leaderImg2,
      socials: [
        {kind: 'facebook', href: '#'},
        {kind: 'twitter', href: '#'},
        {kind: 'linkedin', href: '#'},
        {kind: 'globe', href: '#'},
      ],
    },

    
  ],
  rangpur: [],
  khulna: [],
  mymensingh: [],
  chittagong: [],
  padma: [],
  'dhaka-north': [],
  barishal: [],
  comilla: [],
};

function ZoneTabs({
  value,
  onChange,
}: {
  value: ZoneId;
  onChange: (id: ZoneId) => void;
}) {
  return (
    <div className="mt-7">
      <div
        className="
          flex items-center gap-3
          overflow-x-auto pb-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {ZONES.map(z => {
          const active = z.id === value;

          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onChange(z.id)}
              className={[
                'shrink-0 rounded-full px-6 py-2 text-[12px] font-semibold tracking-[0.18em] transition-all',
                'shadow-[0_10px_25px_rgba(0,0,0,0.10)]',
                active
                  ? 'bg-[#2D8A2D] text-white'
                  : 'bg-[#CFE5C9] text-[#0C2F22] hover:bg-[#BFE0B8]',
              ].join(' ')}
              aria-pressed={active}
            >
              {z.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ZonalCommitteeSection() {
  const [activeZone, setActiveZone] = useState<ZoneId>('dhaka-south');

  const members = useMemo(
    () => ZONAL_MEMBERS[activeZone] ?? [],
    [activeZone],
  );

  return (
    <section className="relative overflow-hidden bg-white py-16">
      {/* subtle geometric line vibe (light) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_20%_10%,#2D8A2D40,transparent_55%)]
          "
        />
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_85%_25%,#1B5FAE40,transparent_55%)]
          "
        />
      </div>

      <div className="lpg-container relative">
        {/* heading (match screenshot: centered + short subtitle) */}
        <div className="mx-auto  text-center">
          <h2 className="text-[28px] font-semibold tracking-tight text-[#133374] md:text-[34px]">
            Zonal Committee ( 2023 - 2025 )
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-[#8A9CB0] md:text-[13px]">
            There are 11 zonal committees of our association to accelerate our
            activities all over the country.
          </p>

          <ZoneTabs value={activeZone} onChange={setActiveZone} />
        </div>

        {/* grid */}
        <div className="mt-10">
          {members.length ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map(m => (
                <CommitteeMemberCard key={m.id} member={m as any} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[18px] border border-[#E3EDF5] bg-white p-8 text-center">
              <p className="text-[13px] text-[#7B8C9C]">
                No members added for this zone yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
