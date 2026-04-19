import { JobRepositoryImpl } from '../../infrastructure/repositories/job.repository.impl';

export class RestoreJobUseCase {
private repo: JobRepositoryImpl;

  constructor(repo: JobRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.restore(id);
    }
}
