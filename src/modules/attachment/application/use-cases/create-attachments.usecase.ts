import { AttachmentRepositoryImpl } from '../../infrastructure/repositories/attachment.repository.impl';
import type { Attachment } from '../../domain/entities/attachment.entity';

export class CreateAttachmentUseCase {
private repo: AttachmentRepositoryImpl;

  constructor(repo: AttachmentRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Attachment>) {
        return this.repo.create(data);
    }
}
