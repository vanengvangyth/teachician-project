import { CommentRepositoryImpl } from '../../infrastructure/repositories/comment.repository.impl';

export class SoftDeleteCommentUseCase {
private repo: CommentRepositoryImpl;

  constructor(repo: CommentRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
