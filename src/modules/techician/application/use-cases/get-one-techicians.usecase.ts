import { TechicianRepositoryImpl } from '../../infrastructure/repositories/techician.repository.impl';

export class GetOneTechicianUseCase {
private repo: TechicianRepositoryImpl;

  constructor(repo: TechicianRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.getOne(id);
    }
}
