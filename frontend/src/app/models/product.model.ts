export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  isLowStock: boolean;
  categoryId: number;
  categoryName: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export const CATEGORY_MAP: { [key: string]: number } = {
  pizza: 1,
  burger: 2,
  drinks: 3
};