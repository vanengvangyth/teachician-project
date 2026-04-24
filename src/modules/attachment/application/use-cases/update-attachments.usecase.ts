import { AttachmentRepositoryImpl } from '../../infrastructure/repositories/attachment.repository.impl';
import type { Attachment } from '../../domain/entities/attachment.entity';

export class UpdateAttachmentUseCase {
private repo: AttachmentRepositoryImpl;

  constructor(repo: AttachmentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Attachment>) {
        return this.repo.update(id, data);
    }
}
