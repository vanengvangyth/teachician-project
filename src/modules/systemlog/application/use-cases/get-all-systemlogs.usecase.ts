import { SystemlogRepositoryImpl } from '../../infrastructure/repositories/systemlog.repository.impl';
import type { GetAllSystemlogsDto} from '../dto/get-all-systemlogs-dto';

export class GetAllSystemlogsUseCase {
private repo: SystemlogRepositoryImpl;

  constructor(repo: SystemlogRepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAllSystemlogsDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
