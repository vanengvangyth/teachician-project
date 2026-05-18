export interface Attachment {
  attachmentId: number;
  job_id: number;
  fileUrl: string;
  fileType: string;
  publicId: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAttachments {
data: Attachment[];
total: number;
}

export interface SingleAttachmentResponse {
data: Attachment;
}
