import { Service_areaRepositoryImpl } from "../../infrastructure/repositories/service_area.repository.impl";
import type { GetAllService_areasDto } from "../dto/get-all-service_areas-dto";
export class GetDeletedService_areasUseCase {
    private repo: Service_areaRepositoryImpl;
    constructor(repo: Service_areaRepositoryImpl) {
        this.repo = repo
    }
    execute(params: GetAllService_areasDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}
