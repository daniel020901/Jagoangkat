import ProductList from "@/components/ProductList"

type SearchParams = Promise<{ 
    page?: string; 
    pageSize?: string; 
    category?: string; // Buat opsional (?) jika tidak selalu ada di URL
    sort?: string;     // Tambahkan sort di sini agar tidak error
}>

const ProductsPage = async ({
    searchParams,
}: {
    searchParams : SearchParams
}) =>{
    const sParams = await searchParams;

    const page = Number(sParams.page)||1;
    const pageSize = Number(sParams.pageSize) || 20;
    const category = sParams.category || "all";
    const sort = sParams.sort || "newest";
    return (
        <div className="">
        <ProductList 
        
        category={category} 
        params="products"
        page={page}
        pageSize={pageSize}
        sort= {sort}
        />
        </div>

    )
}

export default ProductsPage