import { JobRepositoryImpl } from '../../infrastructure/repositories/job.repository.impl';
import type { Job } from '../../domain/entities/jobs.entity';

export class CreateJobUseCase {
private repo: JobRepositoryImpl;

  constructor(repo: JobRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Job>) {
        return this.repo.create(data);
    }
}
