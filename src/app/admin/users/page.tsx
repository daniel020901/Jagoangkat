"use client"
import { motion } from "framer-motion"
import StatCard from "@/components/admin/StatCard"
import { RotateCcw, UserCheck, UserIcon, UserPlus } from "lucide-react"
import UserTable from "@/components/admin/UserTable"

export default function UsersPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-8xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{duration:1}}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                >
                    <StatCard name="Total Clients" icon={UserIcon} value="7670"/>
                    <StatCard name="New Clients" icon={UserPlus} value="860"/>
                    <StatCard name="Active Clients" icon={UserCheck} value="4080"/>
                    <StatCard name="Returning Clients" icon={RotateCcw} value="40.50"/>
                </motion.div>

                <UserTable/>
            
            </main>
        </div>
    )
}