import type { NotificationRepository } from '../../domain/interfaces/notification.repository';
import { notificationApi } from '../api/notification.api';

export class NotificationRepositoryImpl implements NotificationRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return notificationApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return notificationApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return notificationApi.getOne(id);
  }

  async create(data: any) {
    return notificationApi.create(data);
  }

  async update(id: any, data: any) {
    return notificationApi.update(id, data);
  }

  async softDelete(id: any) {
    return notificationApi.softDelete(id);
  }

  async restore(id: any) {
    return notificationApi.restore(id);
  }

  async hardDelete(id: any) {
    return notificationApi.hardDelete(id);
  }
}
