import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';

export class HardDeleteDocumentUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
