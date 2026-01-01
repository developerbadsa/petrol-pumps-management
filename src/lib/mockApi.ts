import { env } from '@/lib/env';

type MockInit = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

type MockResponse = {
  status: number;
  data: any;
};

const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F3E2" />
      <stop offset="100%" stop-color="#CDE7FF" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />
  <circle cx="120" cy="120" r="54" fill="#009970" opacity="0.15" />
  <rect x="190" y="90" width="320" height="180" rx="18" fill="#FFFFFF" opacity="0.85" />
  <text x="350" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#133374">
    LPG Demo
  </text>
</svg>`)};

const MOCK_USER = {
  id: 1,
  full_name: 'Demo Admin',
  email: 'demo@lpg-association.com',
  phone_number: '01700000000',
  role: 'Admin',
};

const MOCK_NOTICES = [
  {
    id: 1,
    title: 'Monthly Coordination Meeting',
    slug: 'monthly-coordination-meeting',
    content:
      'Please join the monthly coordination meeting to review safety updates and operational metrics.',
    publish_date: '2024-08-01',
    created_at: '2024-08-01',
    is_active: true,
    display_order: 1,
    attachments: [],
  },
  {
    id: 2,
    title: 'Safety Training Session',
    slug: 'safety-training-session',
    content:
      'Reminder: mandatory safety training for all station managers will be held this Friday.',
    publish_date: '2024-08-12',
    created_at: '2024-08-12',
    is_active: true,
    display_order: 2,
    attachments: [],
  },
];

const MOCK_BANNERS = [
  {
    id: 1,
    title: 'LPG Awareness Month',
    type: 'HOME',
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: 2,
    title: 'Safety Checklist',
    type: 'HOME',
    image: PLACEHOLDER_IMAGE,
  },
];

const MOCK_POPUPS = [
  {
    id: 1,
    title: 'Emergency Hotline',
    description: 'Call 999 for emergency support and rapid response.',
    start_date: '2024-08-01',
    end_date: '2024-12-31',
    image: PLACEHOLDER_IMAGE,
  },
];

const MOCK_VIDEOS = [
  {
    id: 1,
    title: 'Safe Cylinder Handling',
    youtube_link: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    thumbnail: null,
    created_at: '2024-07-15',
  },
];

const MOCK_ALBUMS = [
  {
    id: 1,
    title: 'Annual Conference',
    cover_url: PLACEHOLDER_IMAGE,
    event_date: '2024-07-20',
  },
  {
    id: 2,
    title: 'Training Workshop',
    cover_url: PLACEHOLDER_IMAGE,
    event_date: '2024-06-12',
  },
];

const MOCK_ALBUM_IMAGES = [
  {
    id: 1,
    album_id: 1,
    image_url: PLACEHOLDER_IMAGE,
  },
  {
    id: 2,
    album_id: 1,
    image_url: PLACEHOLDER_IMAGE,
  },
];

const MOCK_STATIONS = [
  {
    id: 1,
    station_name: 'Green Fuel Station',
    station_owner: {
      user: {
        full_name: 'Rafikul Islam',
        phone_number: '01711111111',
      },
      company_name: 'Green Fuel Ltd',
    },
    division: { name: 'Dhaka' },
    district: { name: 'Dhaka' },
    upazila: { name: 'Tejgaon' },
    station_documents: [{ file_url: PLACEHOLDER_IMAGE }],
  },
  {
    id: 2,
    station_name: 'Blue Flame LPG',
    station_owner: {
      user: {
        full_name: 'Nazia Rahman',
        phone_number: '01822222222',
      },
      company_name: 'Blue Flame Limited',
    },
    division: { name: 'Chattogram' },
    district: { name: 'Chattogram' },
    upazila: { name: 'Pahartali' },
    station_documents: [{ file_url: PLACEHOLDER_IMAGE }],
  },
];

const MOCK_UNVERIFIED_STATIONS = [
  {
    id: 3,
    station_name: 'Sunrise Gas Point',
    station_owner: {
      user: {
        full_name: 'Arif Hossain',
        phone_number: '01933333333',
      },
      company_name: 'Sunrise Gas',
    },
    division: { name: 'Sylhet' },
    district: { name: 'Sylhet' },
    upazila: { name: 'Beanibazar' },
  },
];

const MOCK_OWNERS = [
  {
    id: 1,
    full_name: 'Rafikul Islam',
    email: 'rafikul@example.com',
    phone_number: '01711111111',
    address: 'Tejgaon, Dhaka',
    profile_image: null,
    verification_status: 'APPROVED',
    rejection_reason: null,
  },
  {
    id: 2,
    full_name: 'Nazia Rahman',
    email: 'nazia@example.com',
    phone_number: '01822222222',
    address: 'Agrabad, Chattogram',
    profile_image: null,
    verification_status: 'PENDING',
    rejection_reason: null,
  },
];

const MOCK_CONTACT_MESSAGES = [
  {
    id: 1,
    sender_name: 'Imran Khan',
    sender_email: 'imran@example.com',
    sender_phone: '01744444444',
    subject: 'Membership renewal',
    message: 'Please confirm the renewal process for our station.',
    is_read: false,
    created_at: '2024-08-10T10:15:00Z',
  },
  {
    id: 2,
    sender_name: 'Nusrat Jahan',
    sender_email: 'nusrat@example.com',
    sender_phone: '01855555555',
    subject: 'Safety certificate',
    message: 'When will the next safety certificate be issued?',
    is_read: true,
    created_at: '2024-08-05T09:00:00Z',
  },
];

const MOCK_DIVISIONS = [
  { id: 1, name: 'Dhaka' },
  { id: 2, name: 'Chattogram' },
];

const MOCK_DISTRICTS = [
  { id: 1, name: 'Dhaka', division_id: 1 },
  { id: 2, name: 'Chattogram', division_id: 2 },
];

const MOCK_UPAZILAS = [
  { id: 1, name: 'Tejgaon', district_id: 1 },
  { id: 2, name: 'Pahartali', district_id: 2 },
];

const MOCK_MEMBERSHIP_FEES = [
  { id: 1, name: 'Standard Membership', amount: 12000, duration: '12 months' },
  { id: 2, name: 'Corporate Membership', amount: 25000, duration: '12 months' },
];

const MOCK_STATION_DOCUMENTS = [
  {
    id: 1,
    gas_station_id: 1,
    document_type: 'Trade License',
    file_url: PLACEHOLDER_IMAGE,
  },
  {
    id: 2,
    gas_station_id: 2,
    document_type: 'Fire Safety Certificate',
    file_url: PLACEHOLDER_IMAGE,
  },
];

const MOCK_OTHER_BUSINESSES = [
  {
    id: 1,
    name: 'LPG Safety Consultants',
    address: 'Banani, Dhaka',
    contact: '01777777777',
  },
];

const MOCK_COMMITTEES = [
  {
    id: 1,
    full_name: 'Md. Sajid Hasan',
    designation: 'President',
    company_name: 'LPG Association',
    position_name: 'President',
    position_slug: 'president',
    position_order: 1,
    is_active: 1,
    profile_image: 'https://ui-avatars.com/api/?name=Md.+Sajid+Hasan&size=256&background=E2E8F0&color=0F172A',
    facebook_url: 'https://facebook.com',
    linkedin_url: 'https://linkedin.com',
    whatsapp_url: 'https://wa.me/8801700000000',
  },
];

function normalizePath(path: string) {
  const raw = path.split('?')[0] ?? '';
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function matchId(path: string, base: string) {
  const regex = new RegExp(`^${base}/(\\d+)$`);
  const m = path.match(regex);
  return m ? Number(m[1]) : null;
}

function ok(data: any = { ok: true }): MockResponse {
  return { status: 200, data };
}

export function mockApiFetch(path: string, init: MockInit = {}): MockResponse {
  if (env.dataMode !== 'mock') {
    return { status: 500, data: { message: 'Mock API disabled' } };
  }

  const method = (init.method ?? 'GET').toUpperCase();
  const normalized = normalizePath(path);

  if (normalized === '/login' && method === 'POST') {
    return ok({ access_token: 'mock-token', user: MOCK_USER });
  }

  if (normalized === '/register' && method === 'POST') {
    return ok({ access_token: 'mock-token', user: MOCK_USER });
  }

  if (normalized === '/logout' && method === 'POST') {
    return ok({ ok: true });
  }

  if (normalized === '/me' && method === 'GET') {
    return ok(MOCK_USER);
  }

  if (normalized === '/dashboard-stats' && method === 'GET') {
    return ok({
      total_stations: MOCK_STATIONS.length,
      total_station_owners: MOCK_OWNERS.length,
      unread_messages: MOCK_CONTACT_MESSAGES.filter((m) => !m.is_read).length,
      active_notices: MOCK_NOTICES.filter((n) => n.is_active).length,
    });
  }

  if (normalized === '/notices' && method === 'GET') return ok(MOCK_NOTICES);
  if (normalized.startsWith('/notices/') && method === 'GET') {
    const id = matchId(normalized, '/notices');
    const notice = MOCK_NOTICES.find((n) => n.id === id) ?? MOCK_NOTICES[0];
    return ok(notice);
  }
  if (normalized.startsWith('/notices/') && method === 'DELETE') return ok();
  if (normalized === '/notices' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/banners' && method === 'GET') return ok(MOCK_BANNERS);
  if (normalized.startsWith('/banners/') && method === 'DELETE') return ok();
  if (normalized === '/banners' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/popups' && method === 'GET') return ok(MOCK_POPUPS);
  if (normalized.startsWith('/popups/') && method === 'DELETE') return ok();
  if (normalized === '/popups' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/videos' && method === 'GET') return ok(MOCK_VIDEOS);
  if (normalized.startsWith('/videos/') && method === 'DELETE') return ok();
  if (normalized === '/videos' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/albums' && method === 'GET') return ok(MOCK_ALBUMS);
  if (normalized.startsWith('/albums/') && method === 'DELETE') return ok();
  if (normalized === '/albums' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/album-images' && method === 'GET') return ok(MOCK_ALBUM_IMAGES);
  if (normalized.startsWith('/album-images/') && method === 'DELETE') return ok();
  if (normalized === '/album-images' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/central-committees' && method === 'GET') return ok(MOCK_COMMITTEES);
  if (normalized === '/central-committees' && method === 'POST') return ok({ id: Date.now() });
  if (normalized.startsWith('/central-committees/') && method === 'DELETE') return ok();
  if (normalized.startsWith('/central-committees/') && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/stations/verified' && method === 'GET') return ok(MOCK_STATIONS);
  if (normalized === '/stations/unverified' && method === 'GET') return ok(MOCK_UNVERIFIED_STATIONS);
  if (normalized === '/stations' && method === 'GET') return ok(MOCK_STATIONS);
  if (normalized.startsWith('/stations/') && normalized.endsWith('/verify') && method === 'POST') return ok();
  if (normalized.startsWith('/stations/') && method === 'GET') {
    const id = Number(normalized.split('/')[2]);
    const station = MOCK_STATIONS.find((s) => s.id === id) ?? MOCK_STATIONS[0];
    return ok(station);
  }
  if (normalized.startsWith('/stations/') && method === 'DELETE') return ok();

  if (normalized === '/station-owners' && method === 'GET') return ok(MOCK_OWNERS);
  if (normalized === '/station-owners/register' && method === 'POST') return ok({ id: Date.now() });
  if (normalized.startsWith('/station-owners/') && method === 'PUT') return ok();

  if (normalized === '/contact-messages' && method === 'GET') return ok(MOCK_CONTACT_MESSAGES);
  if (normalized.startsWith('/contact-messages/') && method === 'DELETE') return ok();
  if (normalized === '/contact-messages' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/settings/divisions' && method === 'GET') return ok(MOCK_DIVISIONS);
  if (normalized === '/settings/districts' && method === 'GET') return ok(MOCK_DISTRICTS);
  if (normalized === '/settings/upazilas' && method === 'GET') return ok(MOCK_UPAZILAS);

  if (normalized === '/membership-fees' && method === 'GET') return ok(MOCK_MEMBERSHIP_FEES);
  if (normalized.startsWith('/membership-fees/') && method === 'DELETE') return ok();
  if (normalized === '/membership-fees' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/station-documents' && method === 'GET') return ok(MOCK_STATION_DOCUMENTS);
  if (normalized.startsWith('/station-documents/') && method === 'DELETE') return ok();
  if (normalized === '/station-documents' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/other-businesses' && method === 'GET') return ok(MOCK_OTHER_BUSINESSES);
  if (normalized.startsWith('/other-businesses/') && method === 'DELETE') return ok();
  if (normalized === '/other-businesses' && method === 'POST') return ok({ id: Date.now() });

  if (normalized === '/upload-avatar' && method === 'POST') return ok({ url: PLACEHOLDER_IMAGE });
  if (normalized === '/update-profile' && method === 'POST') return ok({ ok: true });
  if (normalized === '/change-password' && method === 'POST') return ok({ ok: true });

  if (normalized === '/gas-stations' && method === 'GET') return ok(MOCK_STATIONS);
  if (normalized.startsWith('/gas-stations/') && method === 'GET') return ok(MOCK_STATIONS[0]);

  return ok([]);
}
