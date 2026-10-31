import { Technician_serviceRepositoryImpl } from '../../infrastructure/repositories/technician_service.repository.impl';
import type { Technician_service } from '../../domain/entities/technician_service.entity';

export class CreateTechnician_serviceUseCase {
private repo: Technician_serviceRepositoryImpl;

  constructor(repo: Technician_serviceRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Technician_service>) {
        return this.repo.create(data);
    }
}
