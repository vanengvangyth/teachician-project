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
export interface TechicianDocument {
  docId: number;
  technicianId: number;
  documentType: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceArea {
  areaId: string;
  technicianId: number;
  province: string;
  district: string;
  village: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  nameLao: string;
  nameEng: string;
  descriptionLao: string;
  descriptionEng: string;
  iconUrl: string;
}

export interface TechnicianService {
  id: number;
  technicianId: number;
  categoryId: string;
  minPrice: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  category: ServiceCategory;
}


export interface Techician {
  id: number;
  userId: number;
  user?: TechicianUser;
  document?: TechicianDocument[];
  service_area?: ServiceArea[];
  technician_service?: TechnicianService[];
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