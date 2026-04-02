"use client"

import useCartStore from "@/stores/cartStore"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

const ShoppingCartIcon = () => {
    const {cart, hashHydrated} = useCartStore()

    if(!hashHydrated) return null

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
    return (
        <Link href="/cart" className="relative">
            <ShoppingCart className="w-8 h-8 text-gray-600"/>
            {totalItems > 0  && (

                 <span className="absolute -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">{totalItems}</span>
        
            )}
           
        </Link>
    )
}

export default ShoppingCartIcon