import type { CommentRepository } from '../../domain/interfaces/comment.repository';
import { commentApi } from '../api/comment.api';

export class CommentRepositoryImpl implements CommentRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return commentApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return commentApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return commentApi.getOne(id);
  }

  async create(data: any) {
    return commentApi.create(data);
  }

  async update(id: any, data: any) {
    return commentApi.update(id, data);
  }

  async softDelete(id: any) {
    return commentApi.softDelete(id);
  }

  async restore(id: any) {
    return commentApi.restore(id);
  }

  async hardDelete(id: any) {
    return commentApi.hardDelete(id);
  }
}
