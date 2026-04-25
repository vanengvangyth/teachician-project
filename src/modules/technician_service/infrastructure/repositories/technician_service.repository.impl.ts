import type { Technician_serviceRepository } from '../../domain/interfaces/technician_service.repository';
import { technician_serviceApi } from '../api/technician_service.api';

export class Technician_serviceRepositoryImpl implements Technician_serviceRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return technician_serviceApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return technician_serviceApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return technician_serviceApi.getOne(id);
  }

  async create(data: any) {
    return technician_serviceApi.create(data);
  }

  async update(id: any, data: any) {
    return technician_serviceApi.update(id, data);
  }

  async softDelete(id: any) {
    return technician_serviceApi.softDelete(id);
  }

  async restore(id: any) {
    return technician_serviceApi.restore(id);
  }

  async hardDelete(id: any) {
    return technician_serviceApi.hardDelete(id);
  }
}
