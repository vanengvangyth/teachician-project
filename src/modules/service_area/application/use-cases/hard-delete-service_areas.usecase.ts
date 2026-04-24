import { Service_areaRepositoryImpl } from '../../infrastructure/repositories/service_area.repository.impl';

export class HardDeleteService_areaUseCase {
private repo: Service_areaRepositoryImpl;

  constructor(repo: Service_areaRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
