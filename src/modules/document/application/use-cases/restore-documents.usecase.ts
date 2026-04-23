import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';

export class RestoreDocumentUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.restore(id);
    }
}
