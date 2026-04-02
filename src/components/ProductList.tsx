// src/components/ProductList.tsx

import { ProductsType, ProductType } from "@/types";
// import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import { getProductsData , getCategoriesData} from "@/lib/product-server";
import { PaginationWithLinks } from "./ui/pagination-with-links";
import Categories from "./Categories";



interface ProductListProps {
 category: string; 
  params: "homepage" | "products";
  page?:number;
  pageSize?: number;
  sort?: string;
  minPrice ?: string;
  maxPrice ?: string;
  
}
const ProductList = async ({ 
  category,
  params,
  page =1 , 
  pageSize = 12,
  sort = "newest",
  minPrice,
  maxPrice
 
}: ProductListProps) => {
  const allCategories = await getCategoriesData();
  const selectedCategory = allCategories.find(c => c.slug === category);
  const { products, totalCount } = await getProductsData(
    false,              // isAdmin
    page, 
    pageSize, 
    sort, 
    selectedCategory?.id, 
    undefined,          
    minPrice ? parseInt(minPrice) : undefined,
    maxPrice ? parseInt(maxPrice) : undefined
  );
  return (
  <div className="w-full max-w-4xl mx-auto px-3 py-10">
  {/* Header Section: Filter & Categories */}
  <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
    
    <div className="flex items-center gap-4 flex-1 min-w-0">
      
      {/* 1. Filter Button (Tombol Hitam) */}
      {params === "products" && (
        <div className="flex-shrink-0 flex items-center">
          <Filter />
        </div>
      )}
      
      <div className="flex-1  no-scrollbar flex items-center">
        <div className="flex flex-nowrap items-center h-full">
           <Categories categories={allCategories}/>
        </div>
      </div>
    </div>

    <div className="hidden lg:block text-sm text-gray-400">
      Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{totalCount}</span> Products
    </div>
  </div>

  {/* Product Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-12">
    {products.length > 0 ? (
      products.map((product: ProductType) => (
        <ProductCard key={product.id} product={product} />
      ))
    ) : (
      <div className="col-span-full py-20">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center">
             <span className="text-2xl">📦</span>
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
            No products found in this category.
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Pagination Section */}
  <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
    <PaginationWithLinks
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      pageSizeSelectOptions={{
        pageSizeOptions: [12, 20, 50],
      }}
    />
  </div>
</div>
  );
};

export default ProductList;