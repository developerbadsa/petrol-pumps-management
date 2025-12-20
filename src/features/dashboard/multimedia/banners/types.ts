import {StaticImageData} from 'next/image';

export type BannerItem = {
   id: string;
   title?: string;
   imageSrc: string | StaticImageData;
};
