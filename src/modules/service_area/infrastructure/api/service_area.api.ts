import axios from '../../../../service/axios';

export const service_areaApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/service_areas', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('service_areas/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/service_areas', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/service_areas/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/service_areas/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/service_areas/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/service_areas/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/service_areas/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
