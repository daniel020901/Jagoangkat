"use client"
import { useEffect, useState } from "react"
import {ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend} from "recharts"
import {motion} from "framer-motion"


interface CategoryItem {
    name: string;
    value: number;
    color?: string
}
const COLORS = ["#FF6868", "#4D96FF", "#FFD166", "#06D6A0", "#A29BFE"]
export default function CategoryDistributionChart() {
   
   const [categoryData,  setCategoryData] =  useState<CategoryItem[]>([])
   const [isSmallerorMediumScreen , setIsSmallorMediumScreen] = useState(false)

   useEffect(() => {
    fetch("/data/sidebar.json")
    .then((res) => res.json())
    .then((data) => setCategoryData(data.categories))
   }, [])
   
   useEffect(() => {
    const updateScreenSize 
    = () => {
    setIsSmallorMediumScreen(window.innerWidth <= 768)
    }
    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
    }, [])

    const outerRadius = isSmallerorMediumScreen ? 60 : 80
    return (
        <motion.div className="bg-background backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.3, duration:0.5}}
        >
            <h2 className="text-base md:text-lg font-medium mb-4 text-gray-800 dark:text-gray-100 text-center md:text-left"
            
            >Category Distribution</h2>
            
            <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={outerRadius}dataKey="value" label={({name,percent}) => percent ? `${name} ${(percent * 100).toFixed(0)}%`: ""}>

                            {categoryData.map((entry, index) => (
                                <Cell key={`cell${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>

                        <Tooltip contentStyle={{
                            backgroundColor: "rgba(31, 41, 55, 0.8)",
                            borderBlock: "#4b5563",
                            borderRadius:"8px",
                            padding: "8px",
                            fontSize:"12px"
                        }} itemStyle={{color:"#e5e7eb"}}/>
                        <Legend
                        iconType="circle"
                        layout="horizontal"
                        align="center"
                        wrapperStyle={{fontSize:12}}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </motion.div>
    )
}