import { SystemlogRepositoryImpl } from '../../infrastructure/repositories/systemlog.repository.impl';

export class SoftDeleteSystemlogUseCase {
private repo: SystemlogRepositoryImpl;

  constructor(repo: SystemlogRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
