export interface Service_area {
  id: number;
  technician?: {
    id: number;
    user?: {
      id: number;
      email: string;
      fullName: string;
      role: string;
      permissions: string[];
    }
    descriptionLao?: string;
    descriptionEng?: string;
    yearsOfExperience?: number;
  }
  province: string;
  district: string;
  village?: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PaginatedService_areas {
data: Service_area[];
total: number;
}

export interface SingleService_areaResponse {
data: Service_area;
}
