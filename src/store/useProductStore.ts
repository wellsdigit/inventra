import { create } from 'zustand';
import { Product, ProductStatus } from '@/components/products/types';

// Using require for images as in the mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Golden Penny Semovita 1kg',
    sku: 'GPS-1KG-BG',
    price: 1600,
    unit: 'bag',
    stock: 12,
    status: 'In stock',
    image: require('@/assets/images/indomie.png'),
    category: 'Food'
  },
  {
    id: '2',
    name: 'Milo 380g',
    sku: 'MIL-380G-TN',
    price: 1200,
    unit: 'tin',
    stock: 9,
    status: 'Low Stock',
    image: require('@/assets/images/indomie.png'),
    category: 'Beverages'
  },
  {
    id: '3',
    name: 'Coca-Cola 50cl',
    sku: 'CCL-50CL-CR',
    price: 1600,
    unit: 'crate',
    stock: 0,
    status: 'Out of Stock',
    image: require('@/assets/images/coke.png'),
    category: 'Beverages'
  },
  {
    id: '4',
    name: 'Peak Milk Tin',
    sku: 'PMT-TN',
    price: 1230,
    unit: 'tin',
    stock: 12,
    status: 'Expired',
    image: require('@/assets/images/indomie.png'),
    category: 'Beverages'
  },
  {
    id: '5',
    name: 'Indomie Chicken',
    sku: 'IND-CHK-PK',
    price: 220,
    unit: 'Pack',
    stock: 40,
    status: 'In stock',
    image: require('@/assets/images/indomie.png'),
    category: 'Food'
  }
];

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Product;
  deleteProduct: (id: string) => void;
}

const determineStatus = (stock: number): ProductStatus => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In stock';
};

export const useProductStore = create<ProductStore>((set) => ({
  products: mockProducts,
  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      status: determineStatus(productData.stock),
    };

    set((state) => ({
      products: [newProduct, ...state.products],
    }));

    return newProduct;
  },
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter(p => p.id !== id),
    }));
  },
}));
