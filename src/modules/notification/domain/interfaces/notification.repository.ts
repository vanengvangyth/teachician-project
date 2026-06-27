import type{ Notification, PaginatedNotifications, SingleNotificationResponse } from '../entities/notification.entity';

export interface NotificationRepository {
  create(data: Partial<Notification>): Promise<any>;
  getOne(id: any): Promise<SingleNotificationResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<PaginatedNotifications>;
  update(id: any, data: Partial<Notification>): Promise<any>;
  softDelete(id: any): Promise<any>;
  restore(id: any): Promise<any>;
  hardDelete(id: any): Promise<any>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<PaginatedNotifications>;
}
