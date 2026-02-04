import type { TestRepositoryImpl } from "../../infrastructure/repositories/test.repository.impl";
import type { GetAllTestsDto } from "../dto/get-all-tests-dto";

export class GetDeletedTestsUseCase {
    private repo: TestRepositoryImpl;

    constructor(repo: TestRepositoryImpl) {
        this.repo = repo
    }

    execute(params: GetAllTestsDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}