import { Technician_serviceRepositoryImpl } from '../../infrastructure/repositories/technician_service.repository.impl';
import type { GetAllTechnician_servicesDto} from '../dto/get-all-technician_services-dto';

export class GetAllTechnician_servicesUseCase {
private repo: Technician_serviceRepositoryImpl;

  constructor(repo: Technician_serviceRepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAllTechnician_servicesDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
