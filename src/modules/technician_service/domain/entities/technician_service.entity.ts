export interface Technician_service {
  id: number;

  technician?: {
    id: string;
    user?: {
      id: string;
      email: string;
      fullName: string;
      role: string;
      permissions: string[];
    };
    descriptionLao?: string;
    descriptionEng?: string;
    yearsOfExperience?: number;
  };

  category?: {
    id: string;
    nameLao: string;
    nameEng: string;
    descriptionLao: string;
    descriptionEng: string;
    iconUrl: string;
  };

  minPrice: number;
  maxPrice: number;
  description?: string;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaginatedTechnician_services {
data: Technician_service[];
total: number;
}

export interface SingleTechnician_serviceResponse {
data: Technician_service;
}
