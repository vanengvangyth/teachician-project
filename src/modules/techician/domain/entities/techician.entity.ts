export interface TechicianUser {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  profileImageUrl?: string | null;
  role: string;
  permissions: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Techician {
  id: number;
  userId: number;
  user?: TechicianUser;
  descriptionLao: string;
  descriptionEng: string;
  yearsOfExperience: number;
  isApproved: boolean;
  approvedByAdminId: number;
  approvedAt: string;
  totalRating: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedTechicians {
  data: Techician[];
  total: number;
  page?: number;
  perPage?: number;
}

export interface SingleTechicianResponse {
  data: Techician;
}