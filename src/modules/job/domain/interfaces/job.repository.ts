import type{ Job, PaginatedJobs, SingleJobResponse } from '../entities/job.entity';

export interface JobRepository {
  create(data: Partial<Job>): Promise<PaginatedJobs>;
  getOne(id: any): Promise<SingleJobResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Job[]>;
  update(id: any, data: Partial<Job>): Promise<PaginatedJobs>;
  softDelete(id: any): Promise<PaginatedJobs>;
  restore(id: any): Promise<PaginatedJobs>;
  hardDelete(id: any): Promise<PaginatedJobs>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Job[]>;
}
