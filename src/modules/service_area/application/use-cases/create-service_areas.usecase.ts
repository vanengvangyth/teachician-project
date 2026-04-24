import { Service_areaRepositoryImpl } from '../../infrastructure/repositories/service_area.repository.impl';
import type { Service_area } from '../../domain/entities/service_areas.entity';

export class CreateService_areaUseCase {
private repo: Service_areaRepositoryImpl;

  constructor(repo: Service_areaRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Service_area>) {
        return this.repo.create(data);
    }
}
