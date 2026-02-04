import axios from '../../../../service/axios';
import type { PaginatedUsers, SingleUserResponse } from '../../domain/entities/user.entity';

export const userApi = {
  async getAll(page: number = 1, perPage: number = 10, search: string = ''): Promise<any> {
    const res = await axios.get('/users', { params: { page, perPage, search } });
    return res.data;
  },

  async create(data: any) {
    const res = await axios.post('/users', data);
    return res.data;
  },

  async update(id: any, data: any) {
    const res = await axios.put('users/' + id, data);
    return res.data;
  },

  async getone(id: any): Promise<any> {
    const res = await axios.get(`users/${id}`)
    return res;
  },

  softDelete(id: any) {
    const res = axios.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res;
  },

  async restore(id: number) {
    const res = await axios.patch(`user/restore/${id}`)
    return res;
  },


  async hardDelete(id: number) {
    const res = await axios.delete(`user/hard/${id}`)
    return res;
  }
};
