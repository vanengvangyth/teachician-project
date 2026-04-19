import { CommentRepositoryImpl } from '../../infrastructure/repositories/comment.repository.impl';
import type { Comment } from '../../domain/entities/comment.entity';

export class UpdateCommentUseCase {
private repo: CommentRepositoryImpl;

  constructor(repo: CommentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Comment>) {
        return this.repo.update(id, data);
    }
}
