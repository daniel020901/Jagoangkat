"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Edit, Trash2, UserIcon } from "lucide-react"
import Image from "next/image"

interface user {
    id: string |number
    name: string
    image: string | null
    email: string
    role: string
}

export default function UserTable(){
    const [users, setUsers] =useState<user[]>([])
    const [Loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/users')
            if(!response.ok) throw new Error("Gagal Memuat Data")
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {fetchUsers()}, [])

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return(
        <motion.div
        className="bg-background rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-[#1f1f1f]"
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Users Management
                </h2>
                <div className="relative w-full md:w-auto">
                    <input 
                    type="text" 
                    placeholder="Search Users"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18}/>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-[#1f1f1f]">
                    <thead>
                        <tr>
                            {["No", "Name", "Email", "Role"].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{header}</th>
                            ))}
                        </tr>
                    </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {Loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-10">Loading Data...</td>
                                </tr>
                            ):
                            filteredUsers.map((user, index) => {

                                return(
                                    <motion.tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap ">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 relative flex-shrink-0">
                                                   {user.image && user.image.startsWith('http') ? (
                                                    <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    fill
                                                    className="rounded-full object-cover"/>
                                                ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-[#1f1f1f] flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
                                                    <UserIcon size={20} /> 
                                                    </div>
                                                )}
                                                </div>

                                                <div className="ml-4 font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                                </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                         <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex space-x-3 text-gray-400">
                                            <button className="hover:text-blue-500 transition-colors"><Edit size={24} /></button>
                                            <button className="hover:text-red-500 transition-colors"><Trash2 size={24}  /></button>
                                        </div>
                                    </td>
                                    </motion.tr>
                                )
                            })
                            }

                        </tbody>
                </table>
            </div>

        </motion.div>
    )
}