import type{ Document, PaginatedDocuments, SingleDocumentResponse } from '../entities/document.entity';

export interface DocumentRepository {
  create(data: Partial<Document>): Promise<PaginatedDocuments>;
  getOne(id: any): Promise<SingleDocumentResponse | null>;
  getAll(params?: { page?: any; perPage?: any, search?: string }): Promise<Document[]>;
  update(id: any, data: Partial<Document>): Promise<PaginatedDocuments>;
  softDelete(id: any): Promise<PaginatedDocuments>;
  restore(id: any): Promise<PaginatedDocuments>;
  hardDelete(id: any): Promise<PaginatedDocuments>;
  getDeleted(params?: { page?: any; perPage?: any, search?: string }): Promise<Document[]>;
}
