import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';

export class ApproveTechicianUseCase {
  private readonly repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
    this.repo = repo;
  }

  async execute(userId: number): Promise<void> {
    return this.repo.approve(userId);
  }
}