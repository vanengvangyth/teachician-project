import { TestRepositoryImpl } from '../../infrastructure/repositories/test.repository.impl';

export class RestoreTestUseCase {
private repo: TestRepositoryImpl;

  constructor(repo: TestRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.restore(id);
    }
}
