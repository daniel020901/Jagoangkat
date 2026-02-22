import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { productSchema } from "@/types";

export async function DELETE(
    request: Request,
    {params}: {params: Promise <{id: string}>}
) {
    try {
        const session = await getServerSession()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized"}, {status: 401})
        }

        const {id} = await params
        await prisma.product.delete({
            where: {id: id},
        })
        return NextResponse.json({ message: "Product deleted successfully"})
    } catch (error){
        console.error("Error deleting Product:", error)
        return NextResponse.json({message: "Failed to delete product"}, {status: 500})
    }
}

export async function PUT(
    request: Request,
    {params} : { params: Promise<{id: string}>}
) 
{
    try {
        const session = await getServerSession()
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized"}, {status: 401})
        }

        const {id} = await params
        const body = await request.json()

        const validation = productSchema.safeParse(body)

        if(!validation.success) {
            return NextResponse.json({
                message: "Validation failed",
                errors : validation.error.flatten().fieldErrors
            }, { status: 400})
        }

        const data = validation.data

        //update product 
        const updatedProduct = await prisma.product.update({
            where: { id: id},
            data: {
                name: data.name,
                sku: data.sku,
                price: data.price,
                stock: data.stock,
                capacityTon: data.capacityTon,
                lengthM: data.lengthM,
                shortDescription: data.shortDescription,
                description: data.description,
                images: data.images,
                isActive: data.isActive,
            }
        })
        return NextResponse.json({
            message: "Product updated successfully",
            data: updatedProduct
        }, {status:200})

    }catch (error) {
        console.error("Error updating product:", error)
        if (typeof error === 'object' && error !== null && 'code' in error){
        if (error.code === "P2025"){
            return NextResponse.json({ message: " Product not found"}, {status: 404})
        }
        }
        return NextResponse.json({
            message: "Failed to update product",
            error: error instanceof Error ? error.message : String(error)
        }, {status: 500})
    }
}