export interface Document {
  docId: number;
  technicianId?: number | null;

  technician?: {
    id: number;
    user?: {
      id: number;
      email: string;
      fullName: string;
      role: string;
      permissions: string[];
    };
  };

  documentType: string;
  fileUrl: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PaginatedDocuments {
  data: Document[];
  total: number;
}

export interface SingleDocumentResponse {
  data: Document;
}

