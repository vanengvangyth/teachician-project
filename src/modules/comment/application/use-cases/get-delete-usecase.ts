import { CommentRepositoryImpl } from "../../infrastructure/repositories/comment.repository.impl";
import type { GetAllCommentsDto } from "../dto/get-all-comments-dto";
export class GetDeletedCommentsUseCase {
    private repo: CommentRepositoryImpl;
    constructor(repo: CommentRepositoryImpl) {
        this.repo = repo
    }
    execute(params: GetAllCommentsDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}
