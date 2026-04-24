export interface Notification {
  id: number;
  userId: number;
  user?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    permissions: string[];
  };
  titleLao?: string | null;
  titleEng?: string | null;
  message?: string;
  type?: 'job_posted' | 'bid_received' | 'appointment_confirmed' | 'review_posted';
  isRead: boolean;
  referenceId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface PaginatedNotifications {
data: Notification[];
total: number;
}

export interface SingleNotificationResponse {
data: Notification;
}
