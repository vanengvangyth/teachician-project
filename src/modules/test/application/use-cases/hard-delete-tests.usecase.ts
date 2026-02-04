import { TestRepositoryImpl } from '../../infrastructure/repositories/test.repository.impl';

export class HardDeleteTestUseCase {
private repo: TestRepositoryImpl;

  constructor(repo: TestRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
