import type { Service_areaRepository } from '../../domain/interfaces/service_area.repository';
import { service_areaApi } from '../api/service_area.api';

export class Service_areaRepositoryImpl implements Service_areaRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return service_areaApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return service_areaApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return service_areaApi.getOne(id);
  }

  async create(data: any) {
    return service_areaApi.create(data);
  }

  async update(id: any, data: any) {
    return service_areaApi.update(id, data);
  }

  async softDelete(id: any) {
    return service_areaApi.softDelete(id);
  }

  async restore(id: any) {
    return service_areaApi.restore(id);
  }

  async hardDelete(id: any) {
    return service_areaApi.hardDelete(id);
  }
}
