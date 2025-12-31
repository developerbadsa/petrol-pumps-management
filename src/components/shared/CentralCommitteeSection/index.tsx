'use client';

import {type StaticImageData} from 'next/image';
import SectionHeading from '@components/ui/SectionHeading';
import CommitteeMemberCard from './CommitteeMemberCard';



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

const committeeMembers: CommitteeMember[] = [
   {
      id: 'president-1',
      role: 'PRESIDENT',
      name: 'ENGR. MOHAMMAD SERAJUL MAWLA',
      descriptionLines: [
         'Managing Director, Saad Motors Ltd.',
         'Managing Director, SMT Energy Ltd.',
      ],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'vp-1',
      role: 'VICE PRESIDENT',
      name: 'ABDULLAH AL KAFEE',
      descriptionLines: ['Proprietor, Shefaat Fuel Station'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'vp-2',
      role: 'VICE PRESIDENT',
      name: 'KRISHNA KANTA DAS',
      descriptionLines: [
         'Proprietor, K.T. Service Station',
         '& LPG Conversion Center',
      ],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'vp-3',
      role: 'VICE PRESIDENT',
      name: 'T MASHFU BOBBY',
      descriptionLines: ['Managing Director, Super Gas Ltd.'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'vp-4',
      role: 'VICE PRESIDENT',
      name: 'MD. ABDUS SABUR REA',
      descriptionLines: ['Proprietor, Sabur Auto Filling Station'],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'vp-5',
      role: 'VICE PRESIDENT',
      name: 'MD. EMAMUL HASAN',
      descriptionLines: ['Proprietor, Samiron LPG Filling Station'],
      photo: leaderImg2,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'vp-6',
      role: 'VICE PRESIDENT',
      name: 'SAYEDA AKTER',
      descriptionLines: [
         'Proprietor, Green LP Gas Autogas Filling Station & Conversions',
      ],
      photo: leaderImg1,
      socials: [
         {kind: 'facebook', href: '#'},
         {kind: 'twitter', href: '#'},
         {kind: 'linkedin', href: '#'},
         {kind: 'globe', href: '#'},
      ],
   },
   {
      id: 'gs-1',
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
];

export default function CentralCommitteeSection() {
   return (
      <section className='relative bg-[#F4F9F4] py-16'>
         {/* side background glows */}
         <div className='pointer-events-none absolute -left-24 top-[120px] h-[260px] w-[260px] rounded-[40px] bg-[radial-gradient(circle_at_center,_#D5E6FF66,_transparent_70%)]' />
         {/* <div className='pointer-events-none absolute right-[-40px] bottom-[80px] h-[260px] w-[260px] rounded-[40px] bg-[radial-gradient(circle_at_center,_#E1F4E880,_transparent_70%)]' /> */}

         <div className='lpg-container relative'>
            <SectionHeading
               title='CENTRAL COMMITTEE'
               subtitle='The current committee has been formed in a general meeting held on 27 February, 2021. About 200 owners of autogas stations and conversion workshops were present at the meeting chaired by Engr. Mohammad Serajul Mawla. The panel of Engr. Mohammad Serajul Mawla and SMT Energy Ltd. was elected to the present committee. The following panel members are playing important roles in promoting LPG Autogas and LPG Conversion Center across the country as the General Secretary of this association.'
            />

            <div className='mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
               {committeeMembers.map(member => (
                  <CommitteeMemberCard key={member.id} member={member} />
               ))}
            </div>
         </div>
      </section>
   );
}
