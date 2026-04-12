import { CategoryRepositoryImpl } from '../../infrastructure/repositories/category.repository.impl';

export class SoftDeleteCategoryUseCase {
private repo: CategoryRepositoryImpl;

  constructor(repo: CategoryRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
