import type { Techician } from '../../../techician/domain/entities/techician.entity';

export interface Service_area {
  id: number;
  technicianId?: number | null;
  technician?: Techician;
  province: string;
  district: string;
  village?: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PaginatedService_areas {
  data: Service_area[];
  total: number;
}

export interface SingleService_areaResponse {
  data: Service_area;
}
