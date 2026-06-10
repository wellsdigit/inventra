export type ProductStatus = 'In stock' | 'Low Stock' | 'Out of Stock' | 'Expired';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  stock: number;
  status: ProductStatus;
  image: any;
  category: string;
}
