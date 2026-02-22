import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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