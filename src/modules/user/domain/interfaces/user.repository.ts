import type { PaginatedUsers,SingleUserResponse, User } from '../entities/user.entity';

export interface UserRepository {
  getAll(page?: any, perPage?: any, search?: string): Promise<PaginatedUsers>;
  create(data: Partial<User>): Promise<PaginatedUsers>;
  update(id: any, data: Partial<User>): Promise<PaginatedUsers>;
  softDelete(id: any): Promise<PaginatedUsers>;
  restore(id: any): Promise<PaginatedUsers>;
  hardDelete(id: any): Promise<PaginatedUsers>;
  getOne(id: any): Promise<SingleUserResponse>;
}
