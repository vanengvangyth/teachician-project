import type { UserRepository } from '../../domain/interfaces/user.repository';

export class hardDeleteUserUseCase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    execute(id: any) {
        return this.repo.hardDelete(id);
    }
}
