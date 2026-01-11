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
      value:
         "Bangladesh Petroleum Dealer’s, Distributor’s Agent’s & Petrol Pump Owner’s Association",
      img: personIcon,
   },
   {
      id: 'org-name-bn',
      type: 'person',
      label: 'প্রতিষ্ঠানের নাম:',
      value:
         'বাংলাদেশ পেট্রোলিয়াম ডিলার্স,ডিস্ট্রিবিউটার্স,এজেন্ট এন্ড পেট্রোল পাম্প ওনার্স এসোসিয়েশন',
      img: personIcon,
   },
   {
      id: 'established',
      type: 'person',
      label: 'ESTABLISHED:',
      value: '2000',
      img: personIcon,
   },
   {
      id: 'address-primary',
      type: 'location',
      label: 'ADDRESS:',
      value:
         'Gulfesha Plaza, Left-10, Suite No-10/O, 69 Outer Circular Rd, MoghBazar Mor, Dhaka 1217',
      img: locationIcon,
   },
   {
      id: 'address-secondary',
      type: 'location',
      label: 'ADDRESS:',
      value: 'Gulfesha Plaza, 69 Outer Circular Rd, MoghBazar Mor, Dhaka 1217.',
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
   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.0639611584!2d90.25488073778608!3d23.780753035026947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1765343345730!5m2!1sen!2sbd';

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
