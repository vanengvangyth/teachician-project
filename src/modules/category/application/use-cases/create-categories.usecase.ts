import type { Category } from '../../domain/entities/category.entity';
import { CategoryRepositoryImpl } from '../../infrastructure/repositories/category.repository.impl';

export class CreateCategoryUseCase {
private repo: CategoryRepositoryImpl;

  constructor(repo: CategoryRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Category>) {
        return this.repo.create(data);
    }
}
