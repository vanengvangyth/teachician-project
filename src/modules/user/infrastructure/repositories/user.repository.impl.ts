//import type { PaginatedUsers, SingleUserResponse } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/interfaces/user.repository';
import { userApi } from '../api/user.api';

export class UserRepositoryImpl implements UserRepository {
  getOne(id: any): Promise<any> {
    return userApi.getone(id);
  }
  async softDelete(id: any): Promise<any> {
    return userApi.softDelete(id);
  }
  async restore(id: any): Promise<any> {
    return userApi.restore(id);
  }
  async hardDelete(id: any): Promise<any> {
    return userApi.hardDelete(id);
  }
  async getAll(page: any, perPage: any, search: string, role?: string): Promise<any> {
    return userApi.getAll(page, perPage, search, role);
  }

  async create(data: any) {
    return userApi.create(data);
  }

  async update(id: any, data: any) {
    return userApi.update(id, data);
  }
}
