import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';
import type { Techician } from '../../domain/entities/techician.entity';

export class UpdateTechicianUseCase {
private repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Techician>) {
        return this.repo.update(id, data);
    }
}
