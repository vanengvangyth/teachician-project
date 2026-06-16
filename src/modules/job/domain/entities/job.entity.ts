export interface Job {
  jobId: number;
  user?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    phone: string;
    profileImageUrl: string;
    permission: string;
  }
  workerId: number;
  worker: string;
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
  postedAgo: string;
  attachments?: {
    attachmentId: number;
    fileUrl: string;
    fileType: string;
  }
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

