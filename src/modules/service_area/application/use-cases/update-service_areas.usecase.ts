import { Service_areaRepositoryImpl } from '../../infrastructure/repositories/service_area.repository.impl';
import type { Service_area } from '../../domain/entities/service_area.entity';

export class UpdateService_areaUseCase {
private repo: Service_areaRepositoryImpl;

  constructor(repo: Service_areaRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Service_area>) {
        return this.repo.update(id, data);
    }
}
