import type { UserRepository } from '../../domain/interfaces/user.repository';
import type { User } from '../../domain/entities/user.entity';

export class UpdateUserUseCase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    execute(id: any, data: Partial<User>) {
        return this.repo.update(id, data);
    }
}
