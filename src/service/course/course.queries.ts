import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchInstructorsApi, fetchProductByIdApi, fetchProductsApi } from "./course.api";

export const COURSE_QUERY_KEYS = {
  products: ["products"] as const,
  productDetails: (id: string) => ["product", id] as const,
  instructors: ["instructors"] as const,
};

export const useProductsInfiniteQuery = (query: string = "", p0: { enabled: boolean; }) => {
  return useInfiniteQuery({
    queryKey: [...COURSE_QUERY_KEYS.products, query],
    queryFn: ({ pageParam = 1 }) => fetchProductsApi(pageParam as number, 10, query),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there is a next page indicator
      const hasMore = lastPage?.data?.nextPage || lastPage?.nextPage || (lastPage?.data?.data?.length === 10);
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useProductDetailsQuery = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.productDetails(id),
    queryFn: () => fetchProductByIdApi(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInstructorsQuery = (limit: number = 50, p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.instructors,
    queryFn: () => fetchInstructorsApi(limit),
    staleTime: 1000 * 60 * 60,
  });
};
