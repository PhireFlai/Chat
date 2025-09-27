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
        <div>
            <h1>{user?.username}</h1>
            {user &&
                <div>
                    <button onClick={() => navigate("/users")}>Users</button>
                    <button onClick={() => navigate("/chats")}>Chats</button>
                    <button onClick={onLogout}>Log Out</button>
                </div>
            }
            <Outlet />
        </div>
    )
}

export default Nav