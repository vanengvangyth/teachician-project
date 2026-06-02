
import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';

export class RejectTechicianUseCase {
  private readonly repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
    this.repo = repo;
  }

  async execute(userId: number): Promise<void> {
    return this.repo.reject(userId);
  }
}