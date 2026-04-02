import ProductList from "@/components/ProductList"

type SearchParams = Promise<{ 
    page?: string; 
    pageSize?: string; 
    category?: string; // Buat opsional (?) jika tidak selalu ada di URL
    sort?: string;     // Tambahkan sort di sini agar tidak error
    minPrice ?: string;
    maxPrice ?: string;

}>

const ProductsPage = async ({
    searchParams,
}: {
    searchParams : SearchParams
}) =>{
    const sParams = await searchParams;

    const page = Number(sParams.page)||1;
    const pageSize = Number(sParams.pageSize) || 20;
    const category = sParams.category || "undifined";
    const sort = sParams.sort || "newest";
    const minPrice = sParams.minPrice; 
    const maxPrice = sParams.maxPrice;
    return (
        <div className="">
        <ProductList 
        
        category={category} 
        params="products"
        page={page}
        pageSize={pageSize}
        sort= {sort}
        minPrice ={minPrice}
        maxPrice = {maxPrice}
        />
        </div>

    )
}

export default ProductsPage