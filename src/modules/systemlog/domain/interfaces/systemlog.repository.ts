import type{ Systemlog, PaginatedSystemlogs, SingleSystemlogResponse } from '../entities/systemlog.entity';

export interface SystemlogRepository {
  create(data: Partial<Systemlog>): Promise<PaginatedSystemlogs>;
  getOne(id: any): Promise<SingleSystemlogResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Systemlog[]>;
  update(id: any, data: Partial<Systemlog>): Promise<PaginatedSystemlogs>;
  softDelete(id: any): Promise<PaginatedSystemlogs>;
  restore(id: any): Promise<PaginatedSystemlogs>;
  hardDelete(id: any): Promise<PaginatedSystemlogs>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Systemlog[]>;
}
