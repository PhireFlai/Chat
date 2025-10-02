import React, { useContext, useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthContext'


const Nav = () => {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate();

    // handles logout
    const onLogout = async () => {
        await logout();
        navigate("/login")
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <h1
                class="font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2">{user?.username}</h1>
            {user &&
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <button
                        class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                        onClick={() => navigate("/users")}>Users</button>
                    <button
                        class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                        onClick={() => navigate("/chats")}>Chats</button>
                    <button
                        class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        onClick={onLogout}>Log Out</button>
                </div>
            }
            <Outlet />
        </div>
    )
}

export default Nav