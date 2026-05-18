export interface Systemlog {
  log_id: number;
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updatedAt: string;
  deleteAt: string;
}

export interface PaginatedSystemlogs {
data: Systemlog[];
total: number;
}

export interface SingleSystemlogResponse {
data: Systemlog;
}
