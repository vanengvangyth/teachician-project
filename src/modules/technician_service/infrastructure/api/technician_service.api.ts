import axios from '../../../../service/axios';

export const technician_serviceApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/technician_services', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('technician_services/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/technician_services', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/technician_services/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/technician_services/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/technician_services/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/technician_services/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/technician_services/deleted', { params: { page, perPage, search } });
    return res.data;
  }
};
