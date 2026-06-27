import type { NotificationRepository } from '../../domain/interfaces/notification.repository';
import { notificationApi } from '../api/notification.api';

export class NotificationRepositoryImpl implements NotificationRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<any> {
    const res = await notificationApi.getAll(params?.page, params?.perPage, params?.search);
    const data = res?.data || [];
    const mappedData = data.map((item: any) => ({
      ...item,
      id: item.notificationId ?? item.id
    }));
    const total = res?.pagination?.total ?? mappedData.length;
    return {
      data: mappedData,
      total
    };
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<any> {
    try {
      const res = await notificationApi.getDeleted(params?.page, params?.perPage, params?.search);
      const data = res?.data || [];
      const mappedData = data.map((item: any) => ({
        ...item,
        id: item.notificationId ?? item.id
      }));
      const total = res?.pagination?.total ?? mappedData.length;
      return {
        data: mappedData,
        total
      };
    } catch (e) {
      console.warn("getDeleted failed (possibly not implemented on backend):", e);
      return {
        data: [],
        total: 0
      };
    }
  }

  async getOne(id: any): Promise<any> {
    try {
      const res = await notificationApi.getOne(id);
      const item = res.data?.data ?? res.data ?? res;
      return {
        data: {
          ...item,
          id: item.notificationId ?? item.id
        }
      };
    } catch (error) {
      console.warn("Direct getOne failed, falling back to getAll list filtering:", error);
      const listRes = await notificationApi.getAll(1, 1000);
      const list = listRes?.data || [];
      const item = list.find((n: any) => (n.notificationId ?? n.id) === Number(id));
      if (item) {
        return {
          data: {
            ...item,
            id: item.notificationId ?? item.id
          }
        };
      }
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    const res = await notificationApi.create(data);
    const savedList = res?.data || [];
    const savedItem = savedList[0] || res;
    return {
      ...savedItem,
      id: savedItem?.notificationId ?? savedItem?.id
    };
  }

  async update(id: any, data: any): Promise<any> {
    return notificationApi.update(id, data);
  }

  async softDelete(id: any): Promise<any> {
    return notificationApi.softDelete(id);
  }

  async restore(id: any): Promise<any> {
    try {
      return await notificationApi.restore(id);
    } catch (e) {
      console.error("restore failed:", e);
    }
  }

  async hardDelete(id: any): Promise<any> {
    try {
      return await notificationApi.hardDelete(id);
    } catch (e) {
      console.error("hardDelete failed:", e);
    }
  }
}
