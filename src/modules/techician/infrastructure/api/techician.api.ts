import axios from '../../../../service/axios';

export const techicianApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/techicians', { params: { page, perPage, search } });
    return res.data;
  },

  async getOne(id: any): Promise<any> {
    const res = await axios.get('techicians/' + id);
    return res;
  },

  async create(data: any) {
    const res = await axios.post('/techicians', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('/techicians/' + id, data);
    return res.data;
  },

  async softDelete(id: any) {
    const res = await axios.delete('/techicians/' + id);
    return res.data;
  },

  async restore(id: any) {
    const res = await axios.patch('/techicians/restore/' + id);
    return res.data;  
  },

  async hardDelete(id: any) {
    const res = await axios.delete('/techicians/hard/' + id);
    return res.data;
  },

  async getDeleted(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/techicians/deleted', { params: { page, perPage, search } });
    return res.data;
  },

  // ✅ approve/reject → ใช้ PUT /techicians/:id (endpoint เดียวที่ backend มี)
  async approve(id: number): Promise<any> {
    const res = await axios.put(`/techicians/${id}`, { isApproved: true });
    return res.data;
  },

  async reject(id: number): Promise<any> {
    const res = await axios.put(`/techicians/${id}`, { isApproved: false });
    return res.data;
  },

  async getPending(page = 1, perPage = 10, search = ''): Promise<any> {
    const res = await axios.get('/techicians', {
      params: { page, perPage, search, isApproved: false },
    });
    return res.data;
  },
};
