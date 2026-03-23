import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createOrderService } from "@/lib/services/order-service"

export async function GET(){
    try{
        const session = await getServerSession()
        if(!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({
                message:"Unauthorized: Admin access required"
            }, {status: 401})
        }
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name:true,
                        email:true,
                    },
                },
                orderItems: {
                    include: {
                        product:{
                            select: {
                                name:true,
                                images:true,
                                sku:true,
                            },
                        },
                    },
                },
                payment:{
                    select: {
                        status:true,
                        paymentMethod:true,
                        amount:true,
                    }
                }
            }
        })
        return NextResponse.json(orders, {
            status:200,
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        })
    }catch(error){
        console.error("[API_GET_ORDERS] Error:", error)
        return NextResponse.json(
            {message: "Failed to fetch orders"},
            {status: 500}
        )
    }
}

export async function POST (req:Request){
    try{
        const session = await getServerSession();

        if(!session?.user){
            return NextResponse.json(
                {message: "Silahkan Login terlebih Dahulu"},
                {status: 401},
            )
        }
        const body = await req.json()
        const { items, shippingAddress, paymentMethod} = body;

        if(!items || items.length === 0) {
            return NextResponse.json(
                {message: "Keranjang Kosong"},
                {status: 400},
            )
        }

        const newOrder = await createOrderService(
            session.user.id,
            items,
            shippingAddress,
            paymentMethod
        );

        return NextResponse.json(newOrder, {status: 201})
    } catch (error){
         const message = error instanceof Error ? error.message : "Gagal membuat pesanan"
         console.error ("[API_POST_ORDERS] Error :", error)

        const isStockError = message.includes("tidak mencukupi")
        const isNotFound = message.includes("tidak ditemukan")

         return NextResponse.json(
            {message},
            { status: isStockError ? 409 : isNotFound ? 404 : 500},
         )
        
    }
}