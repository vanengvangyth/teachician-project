import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';
import type { PaginatedTechicians } from '../../domain/entities/techician.entity';

export class GetPendingTechiciansUseCase {
  private readonly repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
    this.repo = repo;
  }

  async execute(params?: {
    page?: number;
    perPage?: number;
    search?: string;
  }): Promise<PaginatedTechicians> {
    return this.repo.getPending(params);
  }
}