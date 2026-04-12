import { CategoryRepositoryImpl } from '../../infrastructure/repositories/category.repository.impl';

export class GetOneCategoryUseCase {
private repo: CategoryRepositoryImpl;

  constructor(repo: CategoryRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.getOne(id);
    }
}
