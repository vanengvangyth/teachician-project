export interface Techician {
  id: number;
  userId: number;//FK
  user?: {
    id: number;
    email: string;
    fullName: string;
    fullNam: string;
    role: string;
    permission: string;
  }
  descriptionLao: string;
  descriptionEng: string;
  yearsOfExperience: number;
  isApproved: boolean;
  approvedByAdminId: number;
  approvedAt: string;
  totalRating: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PaginatedTechicians {
data: Techician[];
total: number;
}

export interface SingleTechicianResponse {
data: Techician;
}
