export interface Test {
  id: number;
  email: string;
  createdAt: string;
}

export interface PaginatedTests {
data: Test[];
total: number;
}

export interface SingleTestResponse {
data: Test;
}
