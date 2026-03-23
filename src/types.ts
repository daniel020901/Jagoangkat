import z from "zod";

export type ProductType = {
    id: string ;
    name : string;
    slug:string;
    shortDescription: string;
    description: string;
    sku : string;
    price: number;
    capacityTon : number | null;
    lengthM : number | null;
    stock : number;
    images: string[]
    isActive : boolean;
    categoryName?: string;



}

export const productSchema = z.object({
    name: z.string().min(3, "Nama Produk minimal 3 karakter").trim(),
    sku: z.string().min(3, "SKU minimal 3 Karakter").toUpperCase().trim(),
    price: z.coerce.number().min(1,"Harga harus lebih dari 0"),
    stock: z.coerce.number().min(0,"stock tidak boleh negatif"),
    capacityTon: z.coerce.number().min(1, "Kapasitas Ton tidak boleh negatif").nullable().optional(),
    lengthM: z.coerce.number().min(0, "Panjang tidak boleh negatif").nullable().optional(),
    shortDescription: z.string().max(200, " Deskripsi singkat maksimal 200 karakter").optional(),
    description: z.string().optional(),
    images: z.array(z.string()).min(0, "Minimal unggah 1 foto produk").optional(),
    categoryId: z.number().int("Kategori wajib dipilih"),
    isActive: z.boolean(),

})

export type ProductFormInputs = z.infer<typeof productSchema>


export type ProductsType = ProductType[]

export type CartItemType = ProductType & {
    id : string | number
    quantity:number;
}

export type CartItemsType = CartItemType[]

export const shippingFormSchema = z.object ({
    name:z.string().min(1, "Name is required"),
    email:z.string().min(1, "Email is required"),
    company:z.string().optional(),
    phone:z.string().min(7, "Phone must be between 7 and 12 digits")
    .max(12, "Phone must be between 7 and 12 digits").regex(/^\d+$/, "Phone number must contain only numbers!"),
    address:z.string().min(1,"Address is required"),
    city:z.string().min(1,"City is required"),
})

export type shippingFormInputs = z.infer<typeof shippingFormSchema>

export const paymentFormSchema = z.object ({
    cardHolder:z.string().min(1, "Card holder is required"),
    cardNumber:z.string().min(16, "Card Number is required"),
    expirationDate:z.string().regex(/^(0[1-9] |1[0-2])\/d{2}$/, "Expiration date must be in MM/YY format"),
    cvv:z.string().min(3,"CVV is required").max(3, "CVV is required"),
})

export type paymentFormInputs = z.infer<typeof paymentFormSchema>

export type CartStoreStateType = {
    cart: CartItemsType;
    hashHydrated:boolean
}

export type CartStoreActionsType = {
    addToCart : (product:CartItemType) => void
    removeFromCart : (product:CartItemType) => void
    clearCart : () => void
}

export const OrderSchema = z.object({
    id: z.union([z.string(), z.number()]),
    orderNumber: z.string(),
    status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]),
    totalAmount: z.string(),
    shippingAddress: z.string(),
    createdAt: z.string(),
    user: z.object({
        name: z.string(),
        email: z.string().email(),
    }),
    orderItems: z.array(z.object({
        product: z.object({
            name: z.string(),
        }),
        quantity: z.number(),
    })),
    payment: z.object({
        status: z.string(),
        paymentMethod: z.string(),
    }).nullable().optional(),
})

export type Order = z.infer<typeof OrderSchema>

