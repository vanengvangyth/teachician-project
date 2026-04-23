import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';
import type { Document } from '../../domain/entities/document.entity';

export class CreateDocumentUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Document>) {
        return this.repo.create(data);
    }
}
