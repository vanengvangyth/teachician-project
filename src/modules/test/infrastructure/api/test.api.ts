import axios from '../../../../service/axios';

export const testApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/tests', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('tests/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/tests', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/tests/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/tests/' + id,);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/tests/restore/' + id);
    return res.data;
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/tests/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/tests/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
