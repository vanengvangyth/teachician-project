import { SystemlogRepositoryImpl } from '../../infrastructure/repositories/systemlog.repository.impl';

export class GetOneSystemlogUseCase {
private repo: SystemlogRepositoryImpl;

  constructor(repo: SystemlogRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.getOne(id);
    }
}
