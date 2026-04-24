import type{ Service_area, PaginatedService_areas, SingleService_areaResponse } from '../entities/service_area.entity';

export interface Service_areaRepository {
  create(data: Partial<Service_area>): Promise<PaginatedService_areas>;
  getOne(id: any): Promise<SingleService_areaResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Service_area[]>;
  update(id: any, data: Partial<Service_area>): Promise<PaginatedService_areas>;
  softDelete(id: any): Promise<PaginatedService_areas>;
  restore(id: any): Promise<PaginatedService_areas>;
  hardDelete(id: any): Promise<PaginatedService_areas>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Service_area[]>;
}
