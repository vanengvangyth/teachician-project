import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';
import type { Document } from '../../domain/entities/document.entity';

export class UpdateDocumentUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Document>) {
        return this.repo.update(id, data);
    }
}
