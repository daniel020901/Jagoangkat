'use client'
import { Bell, DollarSign, House, Info, Mail, Menu, Settings,ShoppingBag, ShoppingCart, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const Icons = {
    House,
    DollarSign,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Mail,
    Users,
    Bell,
    Info
}
interface SidebarItem {
    name:string;
    href: string;
    icon: keyof typeof Icons;
}

export default function Sidebar(){
    const[isSidebarOpen, setIsSidebarOpen] = useState(true)

    const [sidebarItems, setSidebarItems] =  useState<SidebarItem[]>([])
    const pathname = usePathname()

    useEffect(() =>{
        fetch("/data/sidebar.json")
        .then((res) => res.json())
        .then((data) => setSidebarItems(data.sidebarItems))
    }, [])
    return (
        <div className = {`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}>
            <div className='h-full bg-background backdrop-blur-md p-4 flex flex-col border-r border-[#2f2f2f]'>

                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='p-2 rounded-full hover:bg-[#2f2f2f] transition-colors max-w-fit cursor-pointer'>
                    <Menu/>
                </button>
                <nav className='mt-8 flex-grow'>
                    {sidebarItems.map((item) =>{
                        const IconComponent = Icons[item.icon]
                        return(
                            <Link key={item.name} href={item.href}>
                                <div className={`flex items-center p-4 text-sm font-medium rounded-lg hover:text-red-800 transition-colors mb-2 ${pathname === item.href ? "bg-red-50 text-red-700 dark:bg-red-950/30" 
        : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>

                                    
                    <IconComponent size={20} style={{ minWidth: "20px" }} />
                                    {isSidebarOpen &&(
                                    <span className='ml-4 whitespace-nowrap'>{item.name}</span>
                                    )}
                                </div>
                            </Link>
                        )
                    })}

                </nav>
            </div>
        </div>
    )
}