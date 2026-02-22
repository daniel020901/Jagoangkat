
import type { ProductFormInputs} from "@/types";



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