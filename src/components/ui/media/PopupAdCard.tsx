'use client';

import Image from 'next/image';
import {Pencil, Trash2} from 'lucide-react';

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(' ');
}

type Props = {
  image: string | any; // url or StaticImageData
  title: string;
  description: string;

  onEdit?: () => void;
  onDelete?: () => void;

  className?: string;
};

export default function PopupAdCard({
  image,
  title,
  description,
  onEdit,
  onDelete,
  className,
}: Props) {
  return (
    <div
      className={cx(
        'overflow-hidden rounded-[10px] bg-white',
        'shadow-[0_18px_45px_rgba(0,0,0,0.14)]',
        className
      )}>
      {/* poster */}
      <div className='p-3'>
        <div className='relative overflow-hidden rounded-[8px] bg-slate-100'>
          {/* tall poster look like screenshot */}
          <div className='relative aspect-[3/4] w-full'>
            <Image
              src={image}
              alt={title}
              fill
              className='object-cover'
              sizes='(max-width: 1024px) 50vw, 25vw'
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className='bg-[#F4F7FB] px-4 pb-3 pt-3'>
        <div className='space-y-[6px]'>
          <div className='text-[10px] leading-4 text-slate-700'>
            <span className='font-semibold text-[#173A7A]'>Tit:</span>{' '}
            <span className='text-slate-700'>{title}</span>
          </div>

          <div className='text-[10px] leading-4 text-slate-700'>
            <span className='font-semibold text-[#173A7A]'>Description:</span>{' '}
            <span className='text-slate-700'>{description}</span>
          </div>
        </div>

        {/* actions (bottom-right like screenshot) */}
        <div className='mt-3 flex items-center justify-end gap-2'>
          <ActionCircle
            ariaLabel='Edit'
            className='bg-[#26B35B]'
            onClick={onEdit}
            icon={<Pencil size={14} className='text-white' />}
          />
          <ActionCircle
            ariaLabel='Delete'
            className='bg-[#E74C3C]'
            onClick={onDelete}
            icon={<Trash2 size={14} className='text-white' />}
          />
        </div>
      </div>
    </div>
  );
}

function ActionCircle({
  icon,
  className,
  onClick,
  ariaLabel,
}: {
  icon: React.ReactNode;
  className: string;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      onClick={onClick}
      className={cx(
        'grid h-8 w-8 place-items-center rounded-full shadow-sm',
        'hover:brightness-110 active:brightness-95',
        className
      )}>
      {icon}
    </button>
  );
}
