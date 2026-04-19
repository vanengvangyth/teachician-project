export interface Comment {
  id: number;
  jobId: number;
  userId: number;
  user?: {
    fullName: string;
    email?: string;
  };
  content: string;
  parentId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PaginatedComments {
data: Comment[];
total: number;
}

export interface SingleCommentResponse {
data: Comment;
}
