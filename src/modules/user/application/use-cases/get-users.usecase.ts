import type { UserRepository } from '../../domain/interfaces/user.repository';
import type { GetAllUsersDto } from '../dto/get-all-dto';

export class GetUsersUseCase {
  private repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async execute(params: GetAllUsersDto = {}) {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const search = params.search ?? '';
    const role = params.role;

    return this.repo.getAll(page, perPage, search, role);
  }
}
