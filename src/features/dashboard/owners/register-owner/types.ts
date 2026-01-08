export type RegisterOwnerInput = {
  stationOwnerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  residentialAddress: string;
  profileImage?: FileList | null;
};

export type RegisterOwnerResult = {
  id: string;
};
