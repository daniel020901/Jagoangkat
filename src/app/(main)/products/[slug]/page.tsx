import ProductInteraction from "@/components/ProductInteraction";
import { getProductBySlug } from "@/lib/product-service";
import { ProductType } from "@/types"
import Image from "next/image"
import { notFound } from "next/navigation";

interface Props{
  params: Promise <{slug:string}>
}

export const generateMetadata = async({params}:{params:Promise<{slug:string}>}) => { 
  const {slug} = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: "Product Not Found" };
  return{
    title: `${product.name} - Jago Angkat`,
    describe: product.shortDescription,
  }
}


const ProductPage = async({params}:{params:Promise<{slug:string}>;}) => {
  const {slug} = await params
  const product = await getProductBySlug(slug);

  if(!product){
    notFound()
  }
    //logika gambar dalam benntuk record <string, string>
    
   const images = JSON.parse(product.images || ' []')
  const firstImage = images[0] || "/placeholder.jpg";


    return (
    
        <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12  pb-12 ">
          {/* Image  */}
          <div className="w-full lg:w-5/12 relative aspect-[2/3] mx-auto max-w-[380px] ">
          <Image src={firstImage} 
          alt={product.name} 
          fill 
          priority
          className="object-contain rounded-md"
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
      />
          </div>
          {/* Details  */}
          <div className="w-full lg:w-7/12 flex flex-col gap-4">
          <h1 className="text-2xl font-medium">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <h2 className="text-2xl font-semibold">Rp .{" "}{product.price.toLocaleString("id-ID")}</h2>
          <ProductInteraction product={product}/>
          {/* Card Info  */}
          <div className="flex items-center gap-2 mt-4">
            <Image src="/atm.jpg" alt="atm" width={50} height={25} className="rounded-md"/>
                    <Image src="/prima.jpg" alt="prima" width={50} height={25} className="rounded-md"/>
                    <Image src="/cards.png" alt="cards" width={50} height={25} className="rounded-md"/>
            
          </div>
          <p className="text-gray-500 text-xs">
            By clicking Pay Now, you agree to our {" "}
            <span className="underline hover:text-black">Terms & Conditions</span> {" "}and <span className="underline hover:text-black">Privacy Policy</span>
            . You authorize us to charge your card for this purchase.
          </p>
          </div>

        </div>
    )
}

export default ProductPage