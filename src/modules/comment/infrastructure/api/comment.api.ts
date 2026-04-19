import axios from '../../../../service/axios';

export const commentApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/comments', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('comments/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/comments', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/comments/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/comments/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/comments/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/comments/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/comments/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
