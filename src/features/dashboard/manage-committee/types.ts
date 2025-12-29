export type CommitteeApiItem = {
  id: number;
  position_name: string;
  position_slug: string;
  position_order: number;
  full_name: string;
  designation: string;
  company_name: string;
  profile_image: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CommitteeRow = {
  id: string;

  fullName: string;
  designation: string;
  companyName: string;

  positionName: string;
  positionSlug: string;
  positionOrder: number;

  isActive: boolean;

  avatarUrl: string;
  profileImageUrl: string | null;

  facebookUrl: string | null;
  linkedinUrl: string | null;
  whatsappUrl: string | null;
};
