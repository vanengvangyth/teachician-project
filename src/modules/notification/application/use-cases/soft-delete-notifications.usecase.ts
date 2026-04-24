import { NotificationRepositoryImpl } from '../../infrastructure/repositories/notification.repository.impl';

export class SoftDeleteNotificationUseCase {
private repo: NotificationRepositoryImpl;

  constructor(repo: NotificationRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.softDelete(id);
    }
}
