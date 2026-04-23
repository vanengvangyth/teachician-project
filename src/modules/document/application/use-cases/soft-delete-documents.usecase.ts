import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';

export class SoftDeleteDocumentUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
