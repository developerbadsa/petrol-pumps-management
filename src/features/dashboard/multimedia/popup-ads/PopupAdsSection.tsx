'use client';

import {useMemo} from 'react';
import {CloudUpload} from 'lucide-react';

import PopupAdCard from '@/components/ui/media/PopupAdCard';
import {MOCK_POPUP_ADS} from './mocks';

export default function PopupAdsSection() {
  const ads = useMemo(() => MOCK_POPUP_ADS, []);

  return (
    <section>
      {/* header row: title center + button right (like screenshot) */}
      <div className='relative flex items-center justify-center'>
        <h2 className='text-[14px] font-medium text-[#173A7A]'>Pop-Up Ads</h2>

        <button
          type='button'
          className='absolute right-0 inline-flex h-8 items-center gap-2 rounded-[6px] bg-[#009970] px-4 text-[11px] font-semibold text-white shadow-sm hover:brightness-110 active:brightness-95'
          onClick={() => console.log('add popup')}
        >
          <CloudUpload size={14} />
          Add Pop-up
        </button>
      </div>

      {/* grid */}
      <div className='mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {ads.map((a) => (
          <PopupAdCard
            key={a.id}
            image={a.image}
            title={a.title}
            description={a.description}
            onEdit={() => console.log('edit', a.id)}
            onDelete={() => console.log('delete', a.id)}
          />
        ))}
      </div>
    </section>
  );
}
