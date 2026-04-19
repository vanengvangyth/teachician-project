import { JobRepositoryImpl } from '../../infrastructure/repositories/job.repository.impl';
import type { Job } from '../../domain/entities/job.entity';

export class UpdateJobUseCase {
private repo: JobRepositoryImpl;

  constructor(repo: JobRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Job>) {
        return this.repo.update(id, data);
    }
}
