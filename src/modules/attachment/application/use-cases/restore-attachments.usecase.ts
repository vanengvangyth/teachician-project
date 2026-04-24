import { AttachmentRepositoryImpl } from '../../infrastructure/repositories/attachment.repository.impl';

export class RestoreAttachmentUseCase {
private repo: AttachmentRepositoryImpl;

  constructor(repo: AttachmentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.restore(id);
    }
}
