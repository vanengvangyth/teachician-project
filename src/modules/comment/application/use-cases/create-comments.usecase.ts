import { CommentRepositoryImpl } from '../../infrastructure/repositories/comment.repository.impl';
import type { Comment } from '../../domain/entities/comment.entity';

export class CreateCommentUseCase {
private repo: CommentRepositoryImpl;

  constructor(repo: CommentRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Comment>) {
        return this.repo.create(data);
    }
}
