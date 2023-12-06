import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import NavProfile from './NavProfile'
import { useState } from 'react'
import { FaTimes, FaBars } from 'react-icons/fa'
import NotificationBar from './NotificationBar'

function Nav() {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0()
  const [open, setOpen] = useState(false)
  const handleMenu = () => {
    setOpen((prev) => !prev)
  }
  return (
    <>
      <div className="bg-white h-18 z-10 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-30">
            <div className="flex items-center">
              <Link to="/" className="text-white">
                <img
                  src="/images/chorequest.png"
                  alt="ChoreQuest Logo"
                  className="h-24"
                />
              </Link>
            </div>
            {/* links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <NotificationBar />
                <Link to="/prizes">
                  <button className="btn-nav">Prizes</button>
                </Link>
                <Link to="/chores">
                  <button className="btn-nav">Chores</button>
                </Link>
                <Link to="/profile">
                  <button className="btn-nav">Profile</button>
                </Link>

                {user ? (
                  <>
                    <NavProfile />
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => loginWithRedirect()}
                  >
                    Login / Sign up
                  </button>
                )}
              </div>
            </div>
            {/* hamburger button */}
            <div className="-mr-2 flex md:hidden">
              <button type="button" onClick={handleMenu} className="btn-nav">
                <span className="sr-only">Open Main Menu</span>
                {open == true ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
        {/* mobile menu */}
        {open ? (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-2">
              <Link to="/prizes" className="btn-nav-mob">
                Prizes
              </Link>
              <Link to="/chores" className="btn-nav-mob">
                Chores
              </Link>
              <Link to="/profile" className="btn-nav-mob">
                Profile
              </Link>
              {user ? (
                <>
                  <NavProfile />
                </>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => loginWithRedirect()}
                >
                  Login / Sign up
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default Nav
