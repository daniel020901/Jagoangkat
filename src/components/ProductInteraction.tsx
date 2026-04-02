"use client"

import { ProductType } from "@/types"
import { Minus, Plus, ShoppingCart } from "lucide-react";
import {  useRouter } from "next/navigation"
import { useState } from "react";
import useCartStore from "@/stores/cartStore";
import {toast} from "react-toastify"



const ProductInteraction = ({product,
   
    }: {
        product: ProductType; }) => {

        // const router = useRouter();
        // const pathname = usePathname(); 
        // const searchParams = useSearchParams();
        const router = useRouter()
        const [quantity, setQuantity] = useState(1)

        const {addToCart, cart} = useCartStore()

        // const handleTypeChange = ( type:string, value:string) =>{
        //     const params = new URLSearchParams(searchParams.toString())
        //     params.set(type, value)
        //     router.push(`${pathname}?${params.toString()}`, {
        //         scroll:false
        //     })

        // }

        const handleQuantityChange = (type:"increment" | "decrement") =>{
          
            if(type === "increment"){
              if(quantity < product.stock){
                
                setQuantity((prev) => prev + 1)
              }else {
                toast.warning(`Stock terbatas! Hanya tersedia ${product.stock} Barang.`)
              }
            }else{
                if(quantity > 1){
                    setQuantity((prev) => prev-1)
              }
          }
        }

        const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
            const value = parseInt(e.target.value)
            if(isNaN(value)  || value < 1){
                setQuantity(1)
            }else if ( value > product.stock) {
              setQuantity(product.stock);
              toast.warning(`Maksimal pembelian adalah ${product.stock} barang.`)
            } else {
                setQuantity(value)
            }
        }

        const handleAddToCart = () =>{

          const existingItem = cart.find((item) => item.id === product.id);
           const currentQtyInCart = existingItem ? existingItem.quantity : 0;

            // 2. Cek apakah penambahan baru akan melebihi stok
            if (currentQtyInCart + quantity > product.stock) {
              toast.error(
                `Gagal! Di keranjang sudah ada ${currentQtyInCart}. Total stok hanya ${product.stock}.`
              );
              return; // Berhenti di sini, jangan lanjut addToCart
               }
          addToCart({
            ...product,
            quantity,
          })
          toast.success("Product added To Cart")
        }

        const handleBuyNow = () => {
          const isItemInCart = cart.some((item) => item.id === product.id)

          if(!isItemInCart){
            
          addToCart({...product, quantity})
          }
          

          router.push("/cart")
        }
  return (
    <div className="flex flex-col gap-4 mt-4 "> 
    {/* Size  */}
    <div className="flex flex-col gap-2 text-sm">
    <span className="text-gray-500">SKU</span>
    <div className="flex items-center gap-2">
    {product.sku}
    </div>
    </div>
    {/* Color  */}
    <div className="flex flex-col gap-2 text-sm">
    <span className="text-gray-500">Length (m)</span>
    <div className="flex items-center gap-2">
    {product.lengthM}
    </div>
    </div>
    {/* Color  */}
    <div className="flex flex-col gap-2 text-sm">
    <span className="text-gray-500">Stock</span>
    <div className="flex items-center gap-2"><span>{product.stock}</span>
    
    </div>
    </div>
    {/* Quantity  */}
    <div className="flex flex-col gap-3">
  {/* Label: slightly larger and darker for readability */}
  <span className="text-sm font-medium text-gray-700">Quantity</span>

  <div className="flex items-center gap-0"> {/* gap-0 because we use borders to join them */}
    
   
    <button 
      className="flex items-center justify-center w-12 h-12 cursor-pointer border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-l-md transition-colors" 
      onClick={() => handleQuantityChange("decrement")}
    >
      <Minus className="w-5 h-5 text-gray-600"/>
    </button>

    
    <input
      type="number"
      inputMode="numeric"
      value={quantity}
      onChange={handleInputChange}
      
      className="w-16 h-12 text-center border-y border-gray-300 text-base font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />

   
    <button 
      className={`flex items-center justify-center w-12 h-12 border border-gray-300 bg-gray-50 rounded-r-md transition-colors ${
      quantity >= product.stock ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer" }`}
      onClick={() => handleQuantityChange("increment")}
      disabled={quantity >= product.stock}
    >
      <Plus className="w-5 h-5 text-gray-600"/>
    </button>
    
  </div>
</div>

    {/* Button  */}
    <button onClick={handleAddToCart} className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer">
    <Plus className="w-4 h-4"/>
    Add to Cart
    </button>
    
    <button onClick={handleBuyNow}className="ring-1 ring-gray-400 shadow-lg text-gray-800 px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium cursor-pointer dark:text-white dark:hover:text-gray-500 transition-colors">
    <ShoppingCart />
    Buy Now

    </button>
    </div>
        );
        };
export default ProductInteraction