import type{ Test, PaginatedTests, SingleTestResponse } from '../entities/test.entity';

export interface TestRepository {
  create(data: Partial<Test>): Promise<PaginatedTests>;
  getOne(id: any): Promise<SingleTestResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Test[]>;
  update(id: any, data: Partial<Test>): Promise<PaginatedTests>;
  softDelete(id: any): Promise<PaginatedTests>;
  restore(id: any): Promise<PaginatedTests>;
  hardDelete(id: any): Promise<PaginatedTests>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Test[]>;
}
