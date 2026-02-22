// src/components/ProductList.tsx

import { ProductsType, ProductType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import { getProductsData } from "@/lib/product-service";



const ProductList = async ({ 
  params 
}: { 
  category: string; 
  params: "homepage" | "products"; 
}) => {
  const products = await getProductsData();

  return (
    <div className="w-full max-w-4xl mx-auto px-3">
      <Categories />
      {params === "products" && <Filter />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.length > 0 ? (
          products.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
      
      <Link href="/products" 
        className="flex justify-end mt-4 underline text-gray-500"
      >
        View All Product
      </Link>
    </div>
  );
};

export default ProductList;