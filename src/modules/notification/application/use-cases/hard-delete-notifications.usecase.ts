import { NotificationRepositoryImpl } from '../../infrastructure/repositories/notification.repository.impl';

export class HardDeleteNotificationUseCase {
private repo: NotificationRepositoryImpl;

  constructor(repo: NotificationRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
