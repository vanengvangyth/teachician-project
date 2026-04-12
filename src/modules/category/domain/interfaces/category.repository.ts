import type{ Category, PaginatedCategorys, SingleCategoryResponse } from '../entities/category.entity';

export interface CategoryRepository {
  create(data: Partial<Category>): Promise<PaginatedCategorys>;
  getOne(id: any): Promise<SingleCategoryResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Category[]>;
  update(id: any, data: Partial<Category>): Promise<PaginatedCategorys>;
  softDelete(id: any): Promise<PaginatedCategorys>;
  restore(id: any): Promise<PaginatedCategorys>;
  hardDelete(id: any): Promise<PaginatedCategorys>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Category[]>;
}
