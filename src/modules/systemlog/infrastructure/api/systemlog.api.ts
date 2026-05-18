import axios from '../../../../service/axios';

export const systemlogApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/systemlogs', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('systemlogs/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/systemlogs', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/systemlogs/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/systemlogs/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/systemlogs/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/systemlogs/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/systemlogs/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
