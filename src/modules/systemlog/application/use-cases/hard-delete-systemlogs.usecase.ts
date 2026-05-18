import { SystemlogRepositoryImpl } from '../../infrastructure/repositories/systemlog.repository.impl';

export class HardDeleteSystemlogUseCase {
private repo: SystemlogRepositoryImpl;

  constructor(repo: SystemlogRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
