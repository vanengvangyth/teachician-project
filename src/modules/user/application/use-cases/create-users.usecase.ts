import type { UserRepository } from '../../domain/interfaces/user.repository';
import type { User } from '../../domain/entities/user.entity';

export class CreateUserUseCase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    execute(data: Partial<User>) {
        return this.repo.create(data);
    }
}
