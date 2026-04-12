import type { CategoryRepository } from '../../domain/interfaces/category.repository';
import { categoryApi } from '../api/category.api';

export class CategoryRepositoryImpl implements CategoryRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return categoryApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return categoryApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return categoryApi.getOne(id);
  }

  async create(data: any) {
    return categoryApi.create(data);
  }

  async update(id: any, data: any) {
    return categoryApi.update(id, data);
  }

  async softDelete(id: any) {
    return categoryApi.softDelete(id);
  }

  async restore(id: any) {
    return categoryApi.restore(id);
  }

  async hardDelete(id: any) {
    return categoryApi.hardDelete(id);
  }
}
