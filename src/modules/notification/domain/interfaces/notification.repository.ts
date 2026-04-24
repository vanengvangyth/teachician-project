import type{ Notification, PaginatedNotifications, SingleNotificationResponse } from '../entities/notification.entity';

export interface NotificationRepository {
  create(data: Partial<Notification>): Promise<PaginatedNotifications>;
  getOne(id: any): Promise<SingleNotificationResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Notification[]>;
  update(id: any, data: Partial<Notification>): Promise<PaginatedNotifications>;
  softDelete(id: any): Promise<PaginatedNotifications>;
  restore(id: any): Promise<PaginatedNotifications>;
  hardDelete(id: any): Promise<PaginatedNotifications>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Notification[]>;
}
