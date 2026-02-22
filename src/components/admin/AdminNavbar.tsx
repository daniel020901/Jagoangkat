import { Bell } from 'lucide-react'
import {ModeToggle} from '../mode-toggle'
import { UserDropdown } from '../user-dropdown'
import { getServerSession } from '@/lib/get-session';

export default async function AdminNavbar() {
    const session = await getServerSession();
      const user = session?.user;
    return (
        <header className="sticky top-0   bg-background inset-x-0 border  shadow-lg backdrop-blur supports-backdrop-filter:bg-background mx-4 mt-4 sm:mx-6 lg:mx-8 rounded-2xl ">
            <div className="max-w-8xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-muted-foreground hover:text-red-700 transitions-color">Dashboard</h1>

                <div className='flex items-center gap-4 '>
                    <Bell className='relative w-5 sm:w-6 h-5 sm:h-6  cursor-pointer hover:text-red-700 transition-colors'
                    
                    />
                    
                <ModeToggle/>
                {user && <UserDropdown user={user}/>}
              
                </div>
            </div>
        </header>
    )
}