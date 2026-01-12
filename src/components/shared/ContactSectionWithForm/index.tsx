'use client';

import ContactInfoCard from './ContactInfoCard';
import type {ContactItem} from './ContactInfoCard';

import callIcon from './img/call.png';
import locationIcon from './img/location.png';
import emailIcon from './img/email.png';
import personIcon from './img/person.png';

import ContactFormPanel from './ContactFormPanel';

const CONTACT_ITEMS: ContactItem[] = [
   {
      id: 'org-name-en',
      type: 'person',
      label: 'ORGANIZATION NAME:',
      value: 'Bangladesh Petroleum Dealer’s, Distributor’s Agent’s & Petrol Pump Owner’s Association',
      img: personIcon,
   },
   {
      id: 'address-primary',
      type: 'location',
      label: 'ADDRESS:',
      value: 'Gulfesha Plaza, Left-10, Suite No-10/O, 69 Outer Circular Rd, MoghBazar Mor, Dhaka 1217',
      img: locationIcon,
   },
   {
      id: 'phone',
      type: 'phone',
      label: 'PHONE:',
      value: '+8801730-178288, +8801615-851373, +8801711-534142',
      img: callIcon,
   },
   {
      id: 'email',
      type: 'email',
      label: 'EMAIL:',
      value: 'info@petroleumstationbd.com',
      img: emailIcon,
   },
];

const MAP_EMBED_URL =
  'https://www.google.com/maps?q=23.7489983375624,90.40547490009656&z=18&output=embed';


export default function ContactUsWithForm() {
   return (
      <div className='relative w-full py-16'>
         <div className='mt-10 grid gap-6 lg:grid-cols-[440px_minmax(0,1fr)]'>
            {/* LEFT: contact cards */}
            <div className='flex flex-col gap-5'>
               {CONTACT_ITEMS.map(item => (
                  <ContactInfoCard key={item.id} item={item} />
               ))}
            </div>

            {/* RIGHT: map + form, extracted */}
            <ContactFormPanel mapUrl={MAP_EMBED_URL} />
         </div>
      </div>
   );
}
