import { DocumentRepositoryImpl } from '../../infrastructure/repositories/document.repository.impl';
import type { GetAllDocumentsDto} from '../dto/get-all-documents-dto';

export class GetAllDocumentsUseCase {
private repo: DocumentRepositoryImpl;

  constructor(repo: DocumentRepositoryImpl) {
   this.repo = repo
  }

  execute(params: GetAllDocumentsDto = {}) {
  const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? ''

    return this.repo.getAll({ page, perPage, search });
  }
}
