import type { DocumentRepository } from '../../domain/interfaces/document.repository';
import { documentApi } from '../api/document.api';

export class DocumentRepositoryImpl implements DocumentRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return documentApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return documentApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return documentApi.getOne(id);
  }

  async create(data: any) {
    return documentApi.create(data);
  }

  async update(id: any, data: any) {
    return documentApi.update(id, data);
  }

  async softDelete(id: any) {
    return documentApi.softDelete(id);
  }

  async restore(id: any) {
    return documentApi.restore(id);
  }

  async hardDelete(id: any) {
    return documentApi.hardDelete(id);
  }
}
