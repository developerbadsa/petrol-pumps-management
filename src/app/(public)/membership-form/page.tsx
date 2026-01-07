import PageHero from '@/components/shared/PageHero';
import Footer from '@/components/layout/Footer';
import heroBg from '@assets/bg-img/download-banner.png';

const formInputClass =
  'h-[34px] w-full rounded-full border border-[#E3E9F6] bg-[#F9FBFF] px-4 text-[12px] text-[#61708A] placeholder:text-[#9AA8BF]';

export default function MembershipFormPage() {
  return (
    <div>
      <PageHero
        title='Membership Form'
        subtitle='অনলাইনে আবেদন করার জন্য এই ফর্মটি পূরণ করুন'
        backgroundImage={heroBg}
        height='compact'
      />

      <section className='lpg-container py-12'>
        <div className='mx-auto max-w-[980px] rounded-[18px] border border-[#E6E8F1] bg-white px-6 py-10 shadow-[0_18px_45px_rgba(0,0,0,0.08)] md:px-10'>
          <div className='text-center'>
            <h2 className='text-[20px] font-semibold text-[#1B2B7A] md:text-[22px]'>
              বাংলাদেশ পেট্রোলিয়াম ডিলারস, ডিস্ট্রিবিউটরস, এজেন্ট এন্ড
              পেট্রোল পাম্প ওনার্স এসোসিয়েশন
            </h2>
            <p className='mt-2 text-[13px] text-[#5E6B83]'>
              অস্থায়ী কার্যালয়: ২/২ পূর্বী (৩য় তলা), রিমকু, ঢাকা-১২০৮
            </p>
            <div className='mt-4 inline-flex items-center justify-center rounded-full border border-[#BBD5B1] px-4 py-1 text-[15px] font-semibold text-[#5FA55A]'>
              মেম্বারশীপ ফরম
            </div>
          </div>

          <form className='mt-10 space-y-4 text-[#1B2B7A]'>
            <div className='grid gap-4 md:grid-cols-[160px_1fr] items-center'>
              <label className='text-[12px] font-medium'>Member&apos;s Name:</label>
              <input className={formInputClass} placeholder='Darrell Dach' />
            </div>

            <div className='grid gap-4 md:grid-cols-[160px_1fr] items-center'>
              <label className='text-[12px] font-medium'>Member&apos;s NID Number:</label>
              <input className={formInputClass} placeholder='(934) 666-8780 x1161' />
            </div>

            <div className='grid gap-4 md:grid-cols-[160px_1fr] items-center'>
              <label className='text-[12px] font-medium'>Station Name & Address:</label>
              <input className={formInputClass} placeholder='(934) 666-8780 x1161' />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>District:</label>
                <input className={formInputClass} placeholder='3806 Deja Overpass, West Reilly' />
              </div>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Member&apos;s Mobile Number:</label>
                <input className={formInputClass} placeholder='(486) 858-8693 x25637' />
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Oil Company Name:</label>
                <input className={formInputClass} placeholder='Padma Oil PLC / Jamuna Petroleum Ltd.' />
              </div>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Type of Business:</label>
                <input className={formInputClass} placeholder='Dealer / Agent' />
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Representative&apos;s Name:</label>
                <input className={formInputClass} placeholder='Garrett Rice' />
              </div>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>NID Number:</label>
                <input className={formInputClass} placeholder='(486) 858-8693 x25637' />
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-[160px_1fr] items-center'>
              <label className='text-[12px] font-medium'>Filling Station Phone Number:</label>
              <input className={formInputClass} placeholder='208-443-5146 x8235' />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Required Documents:</label>
                <input className={formInputClass} placeholder='photograph (2 copies)' />
              </div>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>NID Number:</label>
                <input className={formInputClass} placeholder='(486) 858-8693 x25637' />
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Trade License No.:</label>
                <input className={formInputClass} placeholder='72600-5957' />
              </div>
              <div className='grid gap-2 md:grid-cols-[160px_1fr] items-center'>
                <label className='text-[12px] font-medium'>TIN Number:</label>
                <input className={formInputClass} placeholder='(486) 858-8693 x25637' />
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-[220px_1fr] items-center'>
              <label className='text-[12px] font-medium'>Explosives Department License No.:</label>
              <input className={formInputClass} placeholder='' />
            </div>

            <div className='mt-8 space-y-4 text-[12px] text-[#4E5B73]'>
              <p className='font-semibold text-[#1B2B7A]'>President / Secretary,</p>
              <p>
                I hereby certify that the above information provided is true and correct.
                I humbly request that the mentioned organization be enlisted as a member
                of the Association. I also hereby declare that I shall abide by all rules
                and regulations of the Association.
              </p>
            </div>

            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              <div className='grid gap-2 md:grid-cols-[80px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Date:</label>
                <input className={formInputClass} placeholder='' />
              </div>
              <div className='grid gap-2 md:grid-cols-[180px_1fr] items-center'>
                <label className='text-[12px] font-medium'>Signature of the Applicant:</label>
                <input className={formInputClass} placeholder='' />
              </div>
            </div>

            <div className='mt-10'>
              <div className='text-center text-[13px] font-semibold text-[#1B2B7A] underline'>
                ঢাকা জিলা দেওয়ান ব্যাংক হিসাব
              </div>
              <div className='mt-4 rounded-[12px] bg-gradient-to-r from-[#006D6F] to-[#0AA170] px-6 py-5 text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]'>
                <div className='grid gap-3 text-[12px] md:grid-cols-3'>
                  <div>
                    <p className='opacity-75'>ব্যাংক হিসাবের নাম:</p>
                    <p className='font-semibold uppercase'>
                      Bangladesh Petroleum Dealer&apos;s Distributor&apos;s Agent&apos;s &
                      Petrol Pump Owner&apos;s Association
                    </p>
                  </div>
                  <div>
                    <p className='opacity-75'>ব্যাংক হিসাব নং:</p>
                    <p className='font-semibold'>470901006386</p>
                  </div>
                  <div>
                    <p className='opacity-75'>ব্যাংকের নাম:</p>
                    <p className='font-semibold'>Pubali Bank PLC.</p>
                  </div>
                </div>
                <div className='mt-3 grid gap-3 text-[12px] md:grid-cols-3'>
                  <div>
                    <p className='opacity-75'>শাখা:</p>
                    <p className='font-semibold'>Gulshan Circle-01</p>
                  </div>
                  <div>
                    <p className='opacity-75'>রাউটিং নম্বর:</p>
                    <p className='font-semibold'>175261758</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-6 rounded-[10px] bg-[#FCECEF] px-4 py-3 text-center text-[13px] font-semibold text-[#E53935]'>
              নতুন সদস্য হওয়ার জন্য ভর্তি ফি: ১৫,০০০/- (পনের হাজার) টাকা
              <br />
              বার্ষিক সদস্য ফি: ৫,০০০/- (পাঁচ হাজার) টাকা
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
