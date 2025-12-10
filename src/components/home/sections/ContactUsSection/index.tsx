'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import ContactInfoCard from './ContactInfoCard';

import type {ContactItem} from './ContactInfoCard'
import callIcon from './img/call.png'
import locationIcon from './img/location.png'
import emailIcon from './img/email.png'
import personIcon from './img/person.png'




const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'person',
    type: 'person',
    label: 'CONTACT PERSON:',
    value: 'MD. MOSHARAF HOSSAIN',
    img: personIcon,
  },
  {
    id: 'email',
    type: 'email',
    label: 'EMAIL:',
    value: 'BDLPGAUTOGAS19@GMAIL.COM',
    img: emailIcon,
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'CALL:',
    value: '01704179247',
    img: callIcon,
  },
  {
    id: 'location',
    type: 'location',
    label: 'LOCATION:',
    value: 'HOUSE - 2, ROAD - 2, PALLABI, MIRPUR, DHAKA-1216',
    img: locationIcon,
  },
];

// TODO: replace with real iframe URL from Figma
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d90.366!3d23.815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd';



export default function ContactUsSection() {
  return (
    <section className="relative w-full py-16">
      {/* very soft top glow only, like original */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,#E4F5FF80,_transparent_70%)]" />
      {/* right side dot column */}
      <div className="pointer-events-none absolute right-10 top-52 h-40 w-8 bg-[radial-gradient(circle,#D7E4F5_1.5px,transparent_1.5px)] bg-[length:10px_10px] opacity-80" />

      <div className="lpg-container relative">
        <SectionHeading
          title="CONTACT US"
          subtitle="Have questions or need assistance? Our team is here to help. Reach out to us anytime for quick, friendly, and reliable support."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[440px_minmax(0,1fr)]">
          {/* LEFT: info cards */}
          <div className="flex flex-col gap-5">
            {CONTACT_ITEMS.map(item => (
              <ContactInfoCard key={item.id} item={item} />
            ))}
          </div>

          {/* RIGHT: map + form */}
          <div className="flex flex-col gap-4">
            {/* Map with green border like design */}
            <div
               className="
                 relative h-[230px] w-full overflow-hidden
                 rounded-[18px]
                 border-[3px] border-[#2DD46E]
                 shadow-[0_0_0_1px_rgba(45,212,110,0.35)]
               "
            >
              <iframe
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            {/* Form */}
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* row 1 */}
              <input
                type="text"
                placeholder="Your Name*"
                className="
                  h-[64px] rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 text-[13px]
                  text-[#1E2F4D] placeholder:text-[#9AA6BD]
                  focus:outline-none focus:ring-2 focus:ring-[#16B55B33]
                "
                required
              />
              <input
                type="email"
                placeholder="Your Email*"
                className="
                  h-[64px] rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 text-[13px]
                  text-[#1E2F4D] placeholder:text-[#9AA6BD]
                  focus:outline-none focus:ring-2 focus:ring-[#16B55B33]
                "
                required
              />

              {/* row 2 */}
              <input
                type="text"
                placeholder="Subject"
                className="
                  h-[64px] rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 text-[13px]
                  text-[#1E2F4D] placeholder:text-[#9AA6BD]
                  focus:outline-none focus:ring-2 focus:ring-[#16B55B33]
                "
              />
              <input
                type="tel"
                placeholder="Your Phone*"
                className="
                  h-[64px] rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 text-[13px]
                  text-[#1E2F4D] placeholder:text-[#9AA6BD]
                  focus:outline-none focus:ring-2 focus:ring-[#16B55B33]
                "
                required
              />

              {/* row 3: message full width */}
              <textarea
                placeholder="Message"
                className="
                  md:col-span-2
                  h-[130px] rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 py-3 text-[13px]
                  text-[#1E2F4D] placeholder:text-[#9AA6BD]
                  resize-none
                  focus:outline-none focus:ring-2 focus:ring-[#16B55B33]
                "
              />

              {/* row 4: captcha bar + input */}
              <div
                className="
                  flex h-[54px] items-center
                  rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 text-[12px] text-[#4B5C76]
                "
              >
                {/* fake toolbar icons like figma */}
                <div className="flex items-center gap-2">
                  <span className="h-[18px] w-[18px] rounded-[6px] bg-[#24C77C]" />
                  <span className="h-[18px] w-[18px] rounded-[6px] bg-[#FDCB46]" />
                  <span className="h-[18px] w-[18px] rounded-[6px] bg-[#5C7CFF]" />
                  <span className="h-[18px] w-[18px] rounded-[6px] bg-[#FF5A5F]" />
                </div>
                <button
                  type="button"
                  className="
                    ml-auto flex h-8 w-8 items-center justify-center
                    rounded-full border border-[#DBE7FF]
                    bg-white text-[#7A8799]
                  "
                >
                  ⟳
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter Captcha*"
                className="
                  h-[54px] rounded-[12px]
                  border border-[#E5F0FF]
                  bg-[#F8FBFF]
                  px-4 text-[13px]
                  text-[#1E2F4D] placeholder:text-[#9AA6BD]
                  focus:outline-none focus:ring-2 focus:ring-[#16B55B33]
                "
                required
              />
            </form>

            {/* Button row – centered like design */}
            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                className="
                  inline-flex h-10 items-center justify-center
                  rounded-full bg-[#16B55B]
                  px-10 text-[12px] font-semibold uppercase tracking-[0.18em]
                  text-white shadow-[0_12px_26px_rgba(6,142,76,0.55)]
                  hover:bg-[#14a153] transition-colors
                "
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
