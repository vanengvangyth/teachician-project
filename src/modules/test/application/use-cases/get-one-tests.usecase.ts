import { TestRepositoryImpl } from '../../infrastructure/repositories/test.repository.impl';

export class GetOneTestUseCase {
private repo: TestRepositoryImpl;

  constructor(repo: TestRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.getOne(id);
    }
}
