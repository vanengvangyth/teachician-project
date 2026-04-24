export interface Attachment {
  id: number;
  email: string;
  createdAt: string;
}

export interface PaginatedAttachments {
data: Attachment[];
total: number;
}

export interface SingleAttachmentResponse {
data: Attachment;
}
