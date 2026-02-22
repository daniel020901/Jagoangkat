"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ResponsiveContainer, CartesianGrid, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts"

interface ProductPerformanceData {
    name: string
    sales: number // Diubah dari string ke number agar sesuai JSON
    revenue: number
}

export default function ProductPerformance() {
    // Gunakan nama state huruf kecil untuk membedakan dengan nama Komponen
    const [performanceData, setPerformanceData] = useState<ProductPerformanceData[]>([]) 

    useEffect(() => {
        fetch("/data/sidebar.json")
            .then((res) => res.json())
            .then((data) => {
                if (data && data.productPerformance) {
                    // 1. MENGURUTKAN DATA DARI TERBESAR KE TERKECIL
                    const sortedData = [...data.productPerformance].sort(
                        (a, b) => b.revenue - a.revenue
                    ).slice(0, 10); // Ambil 10 teratas
                    
                    setPerformanceData(sortedData);
                }
            })
            .catch(err => console.error("Gagal load data produk:", err))
    }, [])
    const formatIDR = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };
    const formatXAxis = (tickItem: string) => {
        if (tickItem.length > 12) {
            return `${tickItem.substring(0, 12)}...`;
        }
        return tickItem;
    };
    return (
        <motion.div 
            className="bg-white dark:bg-background backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-gray-200 dark:border-[#1f1f1f] mx-2 md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
        >
            <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 md:text-left">
                Product Performance
            </h2>
            
            <div className="w-full h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374153" vertical={false} opacity={0.3} />
                        
                        <XAxis 
                            dataKey="name" 
                            stroke="#9ca3af" 
                            tick={{ fontSize: 10 }} 
                            interval={0} 
                            angle={-90}
                            textAnchor="end"
                            dx={-8}
                            dy={20}
                            tickFormatter={formatXAxis}
                        />
                        
                        <YAxis  stroke="#9ca3af" tick={{ fontSize: 12 }} width={40} tickFormatter={(value) => `Rp${value/1000000}jt`}/>
                        
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.9)",
                                borderColor: "#4b5563",
                                borderRadius: "8px",
                            }} 
                            itemStyle={{ fontSize: "12px" }}
                        />
                        
                        <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: "20px" }}/>
                        
                      
                        <Bar 
                            name="Unit Terjual"
                            dataKey="sales" 
                            fill="#8B5CF6" 
                            radius={[4, 4, 0, 0]} 
                        />
                        
                        <Bar 
                            name="Pendapatan (Rp)"
                            dataKey="revenue" 
                            fill="#10B981" // Hijau
                            radius={[4, 4, 0, 0]} 
                            hide={false} // Set true jika hanya ingin fokus di unit terjual
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}