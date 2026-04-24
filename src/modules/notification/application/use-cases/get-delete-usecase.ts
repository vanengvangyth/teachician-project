import { NotificationRepositoryImpl } from "../../infrastructure/repositories/notification.repository.impl";
import type { GetAllNotificationsDto } from "../dto/get-all-notifications-dto";
export class GetDeletedNotificationsUseCase {
    private repo: NotificationRepositoryImpl;
    constructor(repo: NotificationRepositoryImpl) {
        this.repo = repo
    }
    execute(params: GetAllNotificationsDto = {}) {
        const page = params.page ?? 1;
        const perPage = params.perPage ?? 10;
        const search = params.search ?? ''
        return this.repo.getDeleted({ page, perPage, search });
    }
}
