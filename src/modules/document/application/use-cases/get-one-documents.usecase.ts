import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';

export class GetOneDocumentUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.getOne(id);
    }
}
