import type { AttachmentRepository } from '../../domain/interfaces/attachment.repository';
import { attachmentApi } from '../api/attachment.api';

export class AttachmentRepositoryImpl implements AttachmentRepository {

  async getAll(params?: { page?: any; perPage?: any, search?: string }) {
    return attachmentApi.getAll(params?.page, params?.perPage, params?.search);
  }

  async getDeleted(params?: { page?: any; perPage?: any, search?: string }) {
    return attachmentApi.getDeleted(params?.page, params?.perPage, params?.search);
  }

  async getOne(id: any): Promise<any> {
    return attachmentApi.getOne(id);
  }

  async create(data: any) {
    return attachmentApi.create(data);
  }

  async update(id: any, data: any) {
    return attachmentApi.update(id, data);
  }

  async softDelete(id: any) {
    return attachmentApi.softDelete(id);
  }

  async restore(id: any) {
    return attachmentApi.restore(id);
  }

  async hardDelete(id: any) {
    return attachmentApi.hardDelete(id);
  }
}
