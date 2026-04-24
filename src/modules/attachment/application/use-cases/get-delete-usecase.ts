import { AttachmentRepositoryImpl } from "../../infrastructure/repositories/attachment.repository.impl";
import type { GetAllAttachmentsDto } from "../dto/get-all-attachments-dto";
export class GetDeletedAttachmentsUseCase {
    private repo: AttachmentRepositoryImpl;
    constructor(repo: AttachmentRepositoryImpl) {
        this.repo = repo
    }
    execute(params: GetAllAttachmentsDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}
