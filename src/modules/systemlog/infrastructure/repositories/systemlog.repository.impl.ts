import type { SystemlogRepository } from '../../domain/interfaces/systemlog.repository';
import { systemlogApi } from '../api/systemlog.api';

export class SystemlogRepositoryImpl implements SystemlogRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return systemlogApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return systemlogApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return systemlogApi.getOne(id);
  }

  async create(data: any) {
    return systemlogApi.create(data);
  }

  async update(id: any, data: any) {
    return systemlogApi.update(id, data);
  }

  async softDelete(id: any) {
    return systemlogApi.softDelete(id);
  }

  async restore(id: any) {
    return systemlogApi.restore(id);
  }

  async hardDelete(id: any) {
    return systemlogApi.hardDelete(id);
  }
}
