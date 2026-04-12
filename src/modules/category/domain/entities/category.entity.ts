export interface Category {
  id: number;
  nameLao: string;
  nameEng: string;
  descriptionLao: string
  descriptionEng: string
  iconUrl: string;
  createdAt: string;
}

export interface PaginatedCategorys {
data: Category[];
total: number;
}

export interface SingleCategoryResponse {
data: Category;
}
