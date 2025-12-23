import {
  LayoutDashboard,
  User,
  Receipt,
  Users,
  Fuel,
  Inbox,
  UsersRound,
  Image as ImageIcon,
  Bell,
  Download,
  Settings,
  LogOut,
} from 'lucide-react';

export type NavChild = { label: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ size?: number }>;
  children?: NavChild[];
};

export const DASH_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'profile', label: 'Edit Profile', href: '/edit-profile', icon: User },
  { key: 'invoice', label: 'Invoice', href: '/invoice', icon: Receipt },

  {
    key: 'owners',
    label: 'Manage Owners',
    icon: Users,
    children: [
      { label: 'Unverified Owner', href: '/manage-owners/unverified' },
      { label: 'Verified Owner', href: '/manage-owners/verified' },
      { label: 'Register new Owner', href: '/manage-owners/register-owner' },
    ],
  },

  {
    key: 'stations',
    label: 'Manage Stations',
    icon: Fuel,
    children: [
      { label: 'Unverified Stations', href: '/manage-stations/unverified' },
      { label: 'Verified Stations', href: '/manage-stations/verified' },
    ],
  },

  { key: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox },
  { key: 'committee', label: 'Manage Committee', href: '/manage-committee', icon: UsersRound },
  {
    key: 'media',
    label: 'Multimedia',
    icon: ImageIcon,
    children: [
      { label: 'Banners', href: '/multimedia/banners' },
      { label: 'Photo Gallery', href: '/multimedia/photo-gallery' },
      { label: 'Video Gallery', href: '/multimedia/video-gallery' },
      { label: 'POPUP Ads', href: '/multimedia/popup-ads' },
    ],
  },
  { key: 'notices', label: 'Notices', href: '/dashboard-notices', icon: Bell },
  { key: 'downloads', label: 'Downloads', href: '/dashboard-downloads', icon: Download },
  { key: 'settings', label: 'Setting', href: '/settings', icon: Settings },
    { key: 'logout', label: 'Logout', href: '/', icon: LogOut },
];

export const DASH_FOOTER: NavItem[] = [
  { key: 'logout', label: 'Logout', href: '/logout', icon: LogOut },
];
