import { CategoryRepositoryImpl } from '../../infrastructure/repositories/category.repository.impl';
import type { Category } from '../../domain/entities/category.entity';

export class UpdateCategoryUseCase {
private repo: CategoryRepositoryImpl;

  constructor(repo: CategoryRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Category>) {
        return this.repo.update(id, data);
    }
}
