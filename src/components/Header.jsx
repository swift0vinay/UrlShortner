import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../assets/react.svg"
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut, LogOutIcon } from 'lucide-react'
import { UrlState } from '@/context'
import useFetch from '@/hooks/use-fetch'
import { logout } from '@/backend/apiAuth'
import { BarLoader } from 'react-spinners'

const Header = () => {
    const navigate = useNavigate();
    const { user, fetchUser } = UrlState()

    const { loading, fn: fnLogout } = useFetch(logout);

    return (
        <>
            <nav className='py-4 flex justify-between items-center'>
                <Link to="/">
                    <img src={Logo} className='h-15' alt="Logo" />
                </Link>

                <div>
                    {!user ?
                        <Button onClick={() => { navigate("/auth") }}>Login</Button>
                        : <DropdownMenu>
                            <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
                                <Avatar>
                                    <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
                                    <AvatarFallback>PA</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LinkIcon className='mr-2 h-4 w-4' />
                                    <span onClick={() => navigate("/dashboard")}>My Links</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400">
                                    <LogOutIcon className='mr-2 h-4 w-4' />
                                    <span onClick={() => {
                                        fnLogout().then(() => {
                                            fetchUser();
                                            navigate("/")
                                        });
                                    }}>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </div>
            </nav>
            {loading && <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />}
        </>
    )
}

export default Header
