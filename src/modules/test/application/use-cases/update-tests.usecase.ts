import { TestRepositoryImpl } from '../../infrastructure/repositories/test.repository.impl';
import type { Test } from '../../domain/entities/test.entity';

export class UpdateTestUseCase {
private repo: TestRepositoryImpl;

  constructor(repo: TestRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Test>) {
        return this.repo.update(id, data);
    }
}
