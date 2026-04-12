import { CategoryRepositoryImpl } from '../../infrastructure/repositories/category.repository.impl';
import type { GetAllCategorysDto} from '../dto/get-all-categories-dto';

export class GetAllCategorysUseCase {
private repo: CategoryRepositoryImpl;

  constructor(repo: CategoryRepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAllCategorysDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
