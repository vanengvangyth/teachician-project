import type{ Comment, PaginatedComments, SingleCommentResponse } from '../entities/comment.entity';

export interface CommentRepository {
  create(data: Partial<Comment>): Promise<PaginatedComments>;
  getOne(id: any): Promise<SingleCommentResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Comment[]>;
  update(id: any, data: Partial<Comment>): Promise<PaginatedComments>;
  softDelete(id: any): Promise<PaginatedComments>;
  restore(id: any): Promise<PaginatedComments>;
  hardDelete(id: any): Promise<PaginatedComments>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Comment[]>;
}
