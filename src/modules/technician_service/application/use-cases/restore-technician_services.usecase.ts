import { Technician_serviceRepositoryImpl } from '../../infrastructure/repositories/technician_service.repository.impl';

export class RestoreTechnician_serviceUseCase {
private repo: Technician_serviceRepositoryImpl;

  constructor(repo: Technician_serviceRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.restore(id);
    }
}
