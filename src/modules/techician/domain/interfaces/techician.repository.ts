import type{ Techician, PaginatedTechicians, SingleTechicianResponse } from '../entities/techician.entity';

export interface TechicianRepository {
  create(data: Partial<Techician>): Promise<PaginatedTechicians>;
  getOne(id: any): Promise<SingleTechicianResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Techician[]>;
  update(id: any, data: Partial<Techician>): Promise<PaginatedTechicians>;
  softDelete(id: any): Promise<PaginatedTechicians>;
  restore(id: any): Promise<PaginatedTechicians>;
  hardDelete(id: any): Promise<PaginatedTechicians>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Techician[]>;
}
