import ContactIcon from './ContactIcon';
import Image, {StaticImageData} from 'next/image';
import cardwrrapper from '@assets/wrappers/horizental-container-grid.png';

export type ContactItemType = 'person' | 'email' | 'phone' | 'location';

export type ContactItem = {
   id: string;
   type: ContactItemType;
   label: string;
   value: string;
   img: StaticImageData;
};

const ContactInfoCard = ({item}: {item: ContactItem}) => {
   return (
      <article
         className='
        relative flex h-[100px] items-center
        rounded-[12px]
       px-6 h-[170px] w-[432px]
        text-white
        overflow-hidden
        shadow-[0_18px_40px_rgba(0,0,0,0.28)]
        bg-[#09090930]
      '>
         <div className='pointer-events-none inset-1 opacity-[0.9] z-0 '>
            <Image src={cardwrrapper} fill alt='' />
         </div>
         <div className='pointer-events-none inset-0 opacity-[0.8] -z-1 '>
            <Image src={item.img} fill alt='' />
         </div>

         <div className='relative mr-5 flex  items-center justify-center'>
            <ContactIcon type={item.type} />
         </div>

         <div className='relative flex flex-col'>
            <span className='text-[24px] font-bold uppercase '>
               {item.label}
            </span>
            <span className='mt-[4px] text-[18px] font-medium leading-snug'>
               {item.value}
            </span>
         </div>
      </article>
   );
};

export default ContactInfoCard;
