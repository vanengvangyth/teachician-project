import axios from '../../../../service/axios';

export const attachmentApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/attachments', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('attachments/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/attachments', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/attachments/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/attachments/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/attachments/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/attachments/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/attachments/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
