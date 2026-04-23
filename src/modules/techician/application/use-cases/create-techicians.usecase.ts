import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';
import type { Techician } from '../../domain/entities/techicians.entity';

export class CreateTechicianUseCase {
private repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Techician>) {
        return this.repo.create(data);
    }
}
