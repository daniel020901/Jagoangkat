"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {Search} from "lucide-react"
import { Order } from "@/types"


export default function OrdersTable(){
    const [orders, setOrders] = useState<Order[]>([])
    const [Loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchOrders = async () => {
        try{
            setLoading(true)
            const response = await fetch('/api/orders')
            if(!response.ok) throw new Error ("Gagal Memuat Data")
            const data = await response.json()
            setOrders(data)
        }catch(error){
            console.error("Error fetching orders:", error)
        }finally{
            setLoading(false)
        }
    }
    useEffect (() => {fetchOrders()}, [])

    const filteredOrders = orders.filter(order => (
        order.orderNumber.toString().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    ))

    

    return (
        <motion.div
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay: 0.4, duration:1}}
        className="bg-background backdrop-blur-md shadow-lg rounded-xl p-4 md:-6 border border-[#1f1f1f] mx-2 md:mx-0"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 text-center md:text-left">Orders List</h2>
                <div className="relative w-full md:w-auto">
                    <input type="text"
                    placeholder="Search Orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                     <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18}/>
                </div>

            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>{[
                            "No",
                            "Order ID",
                            "Customer Name",
                            "Total Amount",
                            "Status",
                            "Date",
                            "Address",
                            "Payment Method",
                            "Actions",
                        ].map((header) => (
                            <th key={header}
                            className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell"
                            >
                                {header}
                            </th>
                        ))}

                        </tr>
                    </thead>
                        <tbody className="divide-y divide-gray-700">
                            {Loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-10">Loading Data...</td>
                                </tr>
                            ): filteredOrders.map((order, index) => {
                                return(
                                    <motion.tr
                                    key={order.orderNumber}
                                    className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                                    >
                                        <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{order.orderNumber.slice(-6)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col"> 
                                                <span className="text-sm font-medium text-gray-200">{order.user.name}</span>
                                                <span className="text-xs text-gray-500">{order.user.email}</span>
                                                </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            Rp {parseInt(order.totalAmount).toLocaleString("id-ID")}
                                            </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${order.status === "DELIVERED" ? "bg-green-800 text-green-100" : order.status === "CANCELLED" ? "bg-red-800 text-red-100" : "bg-blue-800 text-blue-100"}`}>{order.status}
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 max-w-xs truncate">{order.shippingAddress || "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{order.payment?.paymentMethod || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                            View Detail </button> </td>
                                    </motion.tr>
                                )
                            })}

                        </tbody>
                </table>
            </div>
        </motion.div>
    )
}