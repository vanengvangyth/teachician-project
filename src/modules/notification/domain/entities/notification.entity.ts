export interface NotificationUser {
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
export interface Notification {
  id: number;
  userId: number;
  user?: NotificationUser
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
