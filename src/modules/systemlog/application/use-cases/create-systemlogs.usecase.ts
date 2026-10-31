import { SystemlogRepositoryImpl } from '../../infrastructure/repositories/systemlog.repository.impl';
import type { Systemlog } from '../../domain/entities/systemlog.entity';

export class CreateSystemlogUseCase {
private repo: SystemlogRepositoryImpl;

  constructor(repo: SystemlogRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Systemlog>) {
        return this.repo.create(data);
    }
}
