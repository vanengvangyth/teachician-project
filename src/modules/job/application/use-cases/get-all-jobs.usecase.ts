import { JobRepositoryImpl } from '../../infrastructure/repositories/job.repository.impl';
import type { GetAllJobsDto} from '../dto/get-all-jobs-dto';

export class GetAllJobsUseCase {
private repo: JobRepositoryImpl;

  constructor(repo: JobRepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAllJobsDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
