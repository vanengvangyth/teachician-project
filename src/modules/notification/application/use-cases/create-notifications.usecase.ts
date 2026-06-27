import { NotificationRepositoryImpl } from '../../infrastructure/repositories/notification.repository.impl';
import type { Notification } from '../../domain/entities/notification.entity';

export class CreateNotificationUseCase {
private repo: NotificationRepositoryImpl;

  constructor(repo: NotificationRepositoryImpl) {
   this.repo = repo
  }

  execute(data: Partial<Notification>) {
        return this.repo.create(data);
    }
}
