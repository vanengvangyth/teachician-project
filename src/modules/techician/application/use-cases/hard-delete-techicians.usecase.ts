import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';

export class HardDeleteTechicianUseCase {
private repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
