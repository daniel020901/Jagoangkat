"use client"
import { motion } from "framer-motion"
import { CheckCircle, Clock, ShoppingBag,Ban } from "lucide-react"
import StatCard from "@/components/admin/StatCard"
import OrdersTable from "@/components/admin/OrdersTable"

const iconMap = {
    "Completed": CheckCircle,
    "Pending": Clock,
    "Processing": ShoppingBag
}


export default function OrdersPage() {
    return (
        <div className="flex-1 relative overflow-auto z-10">
            <main className="max-w-8xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.5}}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                >
                    <StatCard name="Total Orders" icon={ShoppingBag} value="670"/>
                    <StatCard name="Completed Orders" icon={CheckCircle} value="520"/>
                    <StatCard name="Pending Orders" icon={Clock} value="150"/>
                    <StatCard name="Cancelled Orders" icon={Ban} value="40"/>

                    </motion.div>
                    <OrdersTable/>
            </main>
        </div> 
    )
}