import api from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");

  return response.data;
}

export async function createCategory(
  data: CreateCategoryDto,
): Promise<Category> {
  const response = await api.post<Category>(
    "/categories",
    data,
  );

  return response.data;
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryDto,
): Promise<Category> {
  const response = await api.patch<Category>(
    `/categories/${id}`,
    data,
  );

  return response.data;
}

export async function deleteCategory(
  id: string,
): Promise<void> {
  await api.delete(`/categories/${id}`);
}