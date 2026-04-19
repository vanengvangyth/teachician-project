import type { JobRepository } from '../../domain/interfaces/job.repository';
import { jobApi } from '../api/job.api';

export class JobRepositoryImpl implements JobRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return jobApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return jobApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return jobApi.getOne(id);
  }

  async create(data: any) {
    return jobApi.create(data);
  }

  async update(id: any, data: any) {
    return jobApi.update(id, data);
  }

  async softDelete(id: any) {
    return jobApi.softDelete(id);
  }

  async restore(id: any) {
    return jobApi.restore(id);
  }

  async hardDelete(id: any) {
    return jobApi.hardDelete(id);
  }
}
