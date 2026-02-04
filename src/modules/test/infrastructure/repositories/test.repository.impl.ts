import type { TestRepository } from '../../domain/interfaces/test.repository';
import { testApi } from '../api/test.api';

export class TestRepositoryImpl implements TestRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return testApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return testApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return testApi.getOne(id);
  }

  async create(data: any) {
    return testApi.create(data);
  }

  async update(id: any, data: any) {
    return testApi.update(id, data);
  }

  async softDelete(id: any) {
    return testApi.softDelete(id);
  }

  async restore(id: any) {
    return testApi.restore(id);
  }

  async hardDelete(id: any) {
    return testApi.hardDelete(id);
  }
}
