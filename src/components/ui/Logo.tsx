import Image from 'next/image';
import logo from '../../assets/logo/logo.png';
import Link from 'next/link';

export function Logo({style}: {style?: string}) {
   return (
      <Link
         href='/'
         className={`relative  overflow-hidden rounded-full  flex items-center justify-center `}>
         <Image
            src={logo}
            alt='Association logo'
            className={`object-cover ${style}`}
         />
      </Link>
   );
}
