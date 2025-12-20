import type {OwnerRow} from './types';

// Using a stable placeholder service for mock images.
// If you later want local images, move them to /public and swap photoUrl.
const avatar = (seed: number) => `https://i.pravatar.cc/80?img=${seed}`;

export const MOCK_OWNERS: OwnerRow[] = [
  {
    id: 'own_1',
    memberId: '4405',
    photoUrl: avatar(12),
    ownerName: 'Engr. Md. Serajul Mawla',
    phone: '+880 17xx-xxx-xxx',
    email: 'bogdaish@hotmail.com',
    address: '3348 Cross Lane, North Kayla 28188',
    status: 'UNVERIFIED',
  },
  {
    id: 'own_2',
    memberId: '2786-0920',
    photoUrl: avatar(33),
    ownerName: 'Engr. Md. Serajul Mawla',
    phone: '8071-810-1574',
    email: 'martin.walker@yahoo.com',
    address: '3822 Vine Street, Lake Ally 68902',
    status: 'UNVERIFIED',
  },
  {
    id: 'own_3',
    memberId: '6369-6403',
    photoUrl: avatar(48),
    ownerName: 'Engr. Md. Serajul Mawla',
    phone: '(655) 706-6609',
    email: 'carroll18@yahoo.com',
    address: '89544 Samantha Pike, Renton 2455-7897',
    status: 'UNVERIFIED',
  },
  {
    id: 'own_4',
    memberId: '0890',
    photoUrl: avatar(5),
    ownerName: 'Engr. Md. Serajul Mawla',
    phone: '(457) 991-5802',
    email: 'daniel@gmail.com',
    address: '1735 Fern Rd, Westshire NY700',
    status: 'VERIFIED',
  },
];
