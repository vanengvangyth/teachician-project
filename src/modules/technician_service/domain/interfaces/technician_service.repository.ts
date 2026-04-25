import type{ Technician_service, PaginatedTechnician_services, SingleTechnician_serviceResponse } from '../entities/technician_service.entity';

export interface Technician_serviceRepository {
  create(data: Partial<Technician_service>): Promise<PaginatedTechnician_services>;
  getOne(id: any): Promise<SingleTechnician_serviceResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Technician_service[]>;
  update(id: any, data: Partial<Technician_service>): Promise<PaginatedTechnician_services>;
  softDelete(id: any): Promise<PaginatedTechnician_services>;
  restore(id: any): Promise<PaginatedTechnician_services>;
  hardDelete(id: any): Promise<PaginatedTechnician_services>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Technician_service[]>;
}
