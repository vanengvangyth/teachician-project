import { NotificationRepositoryImpl } from '../../infrastructure/repositories/notification.repository.impl';
import type { Notification } from '../../domain/entities/notification.entity';

export class UpdateNotificationUseCase {
private repo: NotificationRepositoryImpl;

  constructor(repo: NotificationRepositoryImpl) {
   this.repo = repo
  }

  execute(id: any, data: Partial<Notification>) {
        return this.repo.update(id, data);
    }
}
