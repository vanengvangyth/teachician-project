import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';

export class SoftDeleteTechicianUseCase {
private repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
