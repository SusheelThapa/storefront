export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  initialStock: number;
  categoryId: string;
  categoryName: string;
  image: string;
  availableStock: number;
}