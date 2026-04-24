import type{ Attachment, PaginatedAttachments, SingleAttachmentResponse } from '../entities/attachment.entity';

export interface AttachmentRepository {
  create(data: Partial<Attachment>): Promise<PaginatedAttachments>;
  getOne(id: any): Promise<SingleAttachmentResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Attachment[]>;
  update(id: any, data: Partial<Attachment>): Promise<PaginatedAttachments>;
  softDelete(id: any): Promise<PaginatedAttachments>;
  restore(id: any): Promise<PaginatedAttachments>;
  hardDelete(id: any): Promise<PaginatedAttachments>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Attachment[]>;
}
