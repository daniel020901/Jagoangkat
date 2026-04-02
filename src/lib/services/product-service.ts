
import type { ProductFormInputs, ProductType} from "@/types";

interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductsResponse {
  data: ProductType[];
  totalCount: number;
  pagination: PaginationInfo;
}
const API_BASE_URL = "/api/products"

// GET ALL 
export async function getProduct(
  isAdmin: boolean = false,
  page: number = 1,
  pageSize: number = 20,
  sort : string = "newest"
): Promise<ProductsResponse> {
  // Menggunakan URLSearchParams 
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sort: sort
  });
  if (isAdmin) params.append("isAdmin", "true");

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
  
  if (!response.ok) throw new Error("Gagal memuat data product");
  return await response.json();
}
// Create (POST)
export async function createProduct(data:ProductFormInputs) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  })
  const result = await response.json()
  if(!response.ok) throw new Error( result.message || "Gagal menambahkan product")
    return result
  
}


// Update (PUT)
export async function updateProduct(id: string | number, data: ProductFormInputs) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to update");
  return result;
}

// DELETE 
export async function deleteProduct(id: string | number) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",

  })

  if(!response.ok) {
    const errorData = await response.json()
    throw new Error (errorData.message || " Gagal menghapus product")
  }
  return true
}

