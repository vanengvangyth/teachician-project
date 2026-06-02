import type { TechicianRepository } from '../../domain/interfaces/techician.repository';
import { techicianApi } from '../api/techician.api';

export class TechicianRepositoryImpl implements TechicianRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return techicianApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return techicianApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return techicianApi.getOne(id);
  }

  async create(data: any) {
    return techicianApi.create(data);
  }

  async update(id: any, data: any) {
    return techicianApi.update(id, data);
  }

  async softDelete(id: any) {
    return techicianApi.softDelete(id);
  }

  async restore(id: any) {
    return techicianApi.restore(id);
  }

  async hardDelete(id: any) {
    return techicianApi.hardDelete(id);
  }
 // ✅ ใช้ techician.id (ไม่ใช่ userId) เพราะ backend ใช้ PUT /techicians/:id
  async approve(id: number): Promise<any> {
    return techicianApi.approve(id);
  }

  async reject(id: number): Promise<any> {
    return techicianApi.reject(id);
  }

  async getPending(params?: { page?: any; perPage?: any, search?: string }) {
    return techicianApi.getPending(params?.page, params?.perPage, params?.search);
  }
}
