import type { UserRepository } from '../../domain/interfaces/user.repository';

export class restoreUserUseCase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    execute(id: any) {
        return this.repo.restore(id);
    }
}
