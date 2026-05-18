import { SystemlogRepositoryImpl } from '../../infrastructure/repositories/systemlog.repository.impl';
import type { Systemlog } from '../../domain/entities/systemlog.entity';

export class UpdateSystemlogUseCase {
private repo: SystemlogRepositoryImpl;

  constructor(repo: SystemlogRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Systemlog>) {
        return this.repo.update(id, data);
    }
}
