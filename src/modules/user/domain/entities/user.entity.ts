export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  role: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
}

export interface SingleUserResponse {
  data: User;
}


