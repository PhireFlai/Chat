import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'


const Home = () => {
  const { user, allUsers } = useContext(AuthContext)
  const [users, setUsers] = useState([])

  // fetch all users on the site, only used in test currently 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await allUsers()
        setUsers(data)
        // console.log(users)
      } catch (error) {
        console.log("Error, all users could not be fetched")
      }

    }
    fetchUsers();
  }, [])

 // only show users that aren't yourself
  const otherUsers = users.filter(u => u.id !== user?.id);

  return (
    <div>
      {/* <UserList users={otherUsers} /> */}
      This is the Home element
    </div>
  )
}

export default Home
