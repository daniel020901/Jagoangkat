"use client"
import { useEffect, useState } from "react"
import {ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line} from "recharts"
import { motion } from "framer-motion";


export default function SalesOverviewChart(){
    const [salesData, setSalesData] = useState([]);
useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await fetch("/data/sidebar.json")
                const data = await res.json()
                if( data && data.sales){
                    setSalesData(data.sales)
                }
            }catch (err) {
                console.error("Gagal Load Data:", err)
            }
        } 
        fetchData()
}, [])
    
    return (
        <motion.div className="bg-background backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
        initial={{opacity: 0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.2, duration:0.5}}
        >

            <h2 className="text-base md:text-lg font-medium mb-4 text-gray-800 dark:text-gray-100 text-center md:text-left">
                Sales Overview
            </h2>

            <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563"/>

                        <XAxis dataKey="name" stroke="#9ca3af" 
                        tick={{fontSize: 12, fill: "var(--axis-color, #374151"}}
                        className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-600 dark:[&_.recharts-cartesian-axis-tick-value]:fill-gray-400"
                        interval="preserveStartEnd"
                        axisLine={false}
                        />
                        <YAxis stroke="#9ca3af"
                        tick={{ fontSize: 12 }}
                            className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-600 dark:[&_.recharts-cartesian-axis-tick-value]:fill-gray-100"
                        width={40} 
                        axisLine={false}/>

                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "var(--tw-bg-opacity, #fff)",
                                borderRadius: "8px",
                                border: "1px solid #888888",
                                fontSize: "12px",
                            }}
                            itemStyle={{ color: "#9c27b0" }}
                            cursor={{ stroke: '#9c27b0', strokeWidth: 1 }}
                        />

                        <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#9c27b0"
                            strokeWidth={3}
                            dot={{ fill: "#9c27b0", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}