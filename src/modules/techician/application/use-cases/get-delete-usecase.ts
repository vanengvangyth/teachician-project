import { TechicianRepositoryImpl } from "../../infrastructure/repositories/techician.repository.impl";
import type { GetAllTechiciansDto } from "../dto/get-all-techicians-dto";
export class GetDeletedTechiciansUseCase {
    private repo: TechicianRepositoryImpl;
    constructor(repo: TechicianRepositoryImpl) {
        this.repo = repo
    }
    execute(params: GetAllTechiciansDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}
