import axios from '../../../../service/axios';

export const notificationApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/notifications', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('notifications/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/notifications', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/notifications/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/notifications/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/notifications/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/notifications/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/notifications/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
