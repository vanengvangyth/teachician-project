import axios from '../../../../service/axios';

export const documentApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/documents', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('documents/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/documents', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/documents/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/documents/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/documents/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/documents/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/documents/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
