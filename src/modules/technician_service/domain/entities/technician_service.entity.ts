import type { Techician } from "../../../techician/domain/entities/techician.entity";
import type { Category } from "../../../category/domain/entities/category.entity";

export interface Technician_service {
  id: number;
  technicianId?: number | null;
  technician?: Techician;
  categoryId?: number | null;
  category?: Category;

  minPrice: number;
  maxPrice: number;
  description?: string;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaginatedTechnician_services {
  data: Technician_service[];
  total: number;
}

export interface SingleTechnician_serviceResponse {
  data: Technician_service;
}
