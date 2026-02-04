import type { UserRepository } from '../../domain/interfaces/user.repository';

export class softDeleteUserUseCase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    execute(id: any) {
        
        return this.repo.softDelete(id);
    }
}
