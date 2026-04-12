import axios from '../../../../service/axios';

export const categoryApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/categories', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('categories/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/categories', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/categories/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/categories/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/categories/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/categories/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/categories/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
