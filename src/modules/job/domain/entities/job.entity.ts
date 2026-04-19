export interface Job {
  jobId: number;
  user?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    permission: string;
  }
  title: string;
  description: string;
  category?: {
    id: number;
    nameLao: string;
    nameEng: string;
    descriptionLao: string;
    descriptionEng: string;
    iconUrl: string;
  }
  location: string;
  latitude: number;
  longitude: number;
  estimatedDuration: number;
  status: string;
  cancellationReason: string;
  canelledByuserId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PaginatedJobs {
data: Job[];
total: number;
}

export interface SingleJobResponse {
data: Job;
}

