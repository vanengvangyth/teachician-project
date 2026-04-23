import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';
import type { GetAllTechiciansDto} from '../dto/get-all-techicians-dto';

export class GetAllTechiciansUseCase {
private repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAllTechiciansDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
