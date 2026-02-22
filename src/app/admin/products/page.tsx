"use client"
import { motion } from "framer-motion"
import StatCard from "@/components/admin/StatCard"
import ProductTable from "@/components/admin/ProductTable"

import { ChartBarStacked, DollarSign, ShoppingBag, SquareActivity, Users } from "lucide-react"
export default function ProductPage(){
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-8xl mx-auto py-6 px-4 lg:px-8">
                <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 "
                initial={{opacity:0, y: 20}}
                animate={{opacity:1, y: 0}}
                transition={{duration:1}}
                >

                    <StatCard name = "Total Products" icon= {ShoppingBag} value="674"/>
                    <StatCard name = "Stock" icon= {SquareActivity} value="12,845"/>
                    <StatCard name = "Total Sold" icon= {DollarSign} value="12,432"/>
                    <StatCard name = "Total categories" icon= {ChartBarStacked} value="674"/>

                </motion.div>
                <ProductTable/>
            </main>

        </div>
    )
}