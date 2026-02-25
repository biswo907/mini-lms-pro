import http from "../api/http";

export interface Product {
  id: string;
  name: string;
  title?: string; // API returns title
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  image?: string; 
  images?: string[]; 
  instructor?: Instructor;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

export const fetchProductsApi = async (page: number = 1, limit: number = 10, query: string = "") => {
  const response = await http.get(`/public/randomproducts`, {
    params: {
      page,
      limit,
      query,
    },
  });
  return response.data;
};

export const fetchInstructorsApi = async (limit: number = 50) => {
  const response = await http.get(`/public/randomusers`, {
    params: {
      page: 1,
      limit,
    },
  });
  return response.data;
};

export const fetchProductByIdApi = async (productId: string) => {
  const response = await http.get(`/public/randomproducts/${productId}`);
  return response.data;
};
