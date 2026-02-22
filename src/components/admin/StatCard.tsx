import {motion} from "framer-motion"
import { LucideIcon } from "lucide-react"


interface StatCardProps {
    name: string
    icon : LucideIcon
    value: string | number
}
export default function StatCard({name, icon:Icon, value}: StatCardProps){
    return(
        <motion.div
        whileHover={{y:-5, boxShadow: "0 250px 50px -12px rgba(0,0,0, 0.5"}}
        className="bg-background backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-[#1f1f1f] ">
            <div className="px-4 py-5 sm:p-6 ">
                <span className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-100">
                    <Icon size={20} className="mr-2 "/>
                    {name}
                   
                </span>
                 <p className="mt-1 text-3xl font-semibold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </motion.div>
    )
}