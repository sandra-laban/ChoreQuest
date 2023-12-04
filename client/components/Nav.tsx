import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import NavProfile from './NavProfile'
import NotificationBar from './NotificationBar'

function Nav() {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0()
  return (
    <div className="flex justify-around items-center fixed top-0 w-full bg-white h-18 z-10 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300">
      <Link to="/">
        <img
          src="/images/chorequest.png"
          alt="ChoreQuest Logo"
          className="h-32"
        />
      </Link>
      <Link to="/prizes">
        <button className="btn-nav">PRIZES</button>
      </Link>
      <Link to="/chores">
        <button className="btn-nav">CHORES</button>
      </Link>
      <Link to="/profile">
        <button className="btn-nav">PROFILE</button>
      </Link>
      <NotificationBar />
      {user ? (
        <>
          <NavProfile />
        </>
      ) : (
        <button className="btn-primary" onClick={() => loginWithRedirect()}>
          Login / Sign up
        </button>
      )}
    </div>
  )
}

export default Nav
