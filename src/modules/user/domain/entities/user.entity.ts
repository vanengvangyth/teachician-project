export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  role: string;
  phone: string;
  profileImageUrl?: string | null;
  profile_image_url?: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
}

export interface SingleUserResponse {
  data: User;
}


