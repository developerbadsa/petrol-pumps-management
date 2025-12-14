import Image from 'next/image';
import type { FC } from 'react';
import type { CommitteeMember } from './index';

import {
  TwitterIcon,
  PhoneIcon,
  FacebookIcon,
  LinkedinIcon,
} from '@/assets/ui-icons/svgs/socialmediaIcons';

type SocialKind = 'twitter' | 'phone' | 'linkedin' | 'facebook';

type SocialIconComponent = FC<{ className?: string }>;

const socialIconMap: Record<SocialKind, SocialIconComponent> = {
  twitter: TwitterIcon,
  phone: PhoneIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
};

export default function CommitteeMemberCard({
  member,
}: {
  member: CommitteeMember;
}) {
  return (
    <article
      className="
        relative flex  flex-col items-center justify-between
        rounded-[20px]  min-w-[280px] max-w-[300px]
        bg-gradient-to-b from-[#FBFEFF] via-[#F7FAFF] to-[#ECF3FF]
        px-7 pb-8 pt-12
        shadow-[0_18px_40px_rgba(22,101,175,0.14)] h-[500px]
      "
    >
      {/* role */}
      <p className="mt-1 text-center text-[22px] font-bold uppercase tracking-[0.01em] secondary-text">
        {member.role}
      </p>

      {/* photo */}
      <div className="mt-5 flex justify-center">
        <div
          className="
            flex h-[170px] w-[170px] items-center justify-center
            rounded-full border-[6px] border-[#60B13D] bg-white
          "
        >
          <div className="relative h-[146px] w-[146px] overflow-hidden rounded-full bg-white">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              sizes="146px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* name + description */}
      <div className="mt-6 text-center h-[270px] overflow-hidden flex flex-col justify-evenly">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#153976]">
          {member.name}
        </h3>

        <div className="mt-3 space-y-[3px] text-[11px] leading-snug text-[#7A8799]">
          {member.descriptionLines.map(line => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>

      {/* social icons row */}
      <div className="mt-6 flex justify-center gap-3 text-white ">
        {member.socials.map(social => {
          const Icon = socialIconMap[social.kind as SocialKind];
          if (!Icon) return null;

          return (
            <a
              key={`${member.name}-${social.kind}`}
              href={social.href}
              aria-label={social.kind}
             className=""
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          );
        })}
      </div>
    </article>
  );
}
