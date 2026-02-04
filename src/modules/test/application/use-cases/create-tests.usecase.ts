import { TestRepositoryImpl } from '../../infrastructure/repositories/test.repository.impl';
import type { Test } from '../../domain/entities/tests.entity';

export class CreateTestUseCase {
private repo: TestRepositoryImpl;

  constructor(repo: TestRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Test>) {
        return this.repo.create(data);
    }
}
