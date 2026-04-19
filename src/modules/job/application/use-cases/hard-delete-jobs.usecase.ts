import { JobRepositoryImpl } from '../../infrastructure/repositories/job.repository.impl';

export class HardDeleteJobUseCase {
private repo: JobRepositoryImpl;

  constructor(repo: JobRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
