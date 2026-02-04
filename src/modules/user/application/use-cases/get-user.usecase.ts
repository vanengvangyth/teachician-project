import type { UserRepository } from '../../domain/interfaces/user.repository';

export class getOneUserUseCase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    execute(id: any) {
        return this.repo.getOne(id);
    }
}
