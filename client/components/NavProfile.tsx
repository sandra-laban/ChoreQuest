import { getUser } from '../apis/userApi'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa'
import FamilyPage from './FamilyPage'

export default function Profile() {
  const { getAccessTokenSilently, isAuthenticated, logout } = useAuth0()
  const navigate = useNavigate()

  const accessTokenPromise = getAccessTokenSilently()

  const { data, error, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })
  // dropdown
  const [dropdown, setDropdown] = useState(false)
  const handleDropdown = () => {
    setDropdown((prev) => !prev)
  }
  const profile = data?.profile

  if (!profile?.family_id) {
    return (
      <button
        className="btn-nav"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        LOGOUT?
      </button>
    )
  } else if (profile && profile.family_id) {
    return (
      <>
        <div className="md:block md:relative">
          <button
            type="button"
            onClick={handleDropdown}
            className="btn-primary flex items-center"
          >
            <span className="sr-only">Open user menu</span>
            <img
              src={profile.picture}
              alt={profile.name}
              className="w-8 h-8 me-2 rounded-full"
            />
            {profile.name}
            {dropdown == true ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {dropdown ? (
            <div className="md:visible md:absolute md:right-0">
              <div className="bg-white text-center divide-y divide-gray-100 rounded-lg border border-b-4 border-gray-400 w-52 dark:bg-gray-700 dark:divide-gray-600">
                <div>
                  <div className="flex pt-4 w-full justify-center items-center">
                    <img
                      src={profile.picture}
                      alt={profile.name}
                      className="w-24 h-24 me-2 rounded-full"
                    />
                  </div>
                  <h2 className="mx-6">{profile.name}</h2>
                  {!profile.is_parent ? (
                    <h3 className="mx-6 text-base">
                      Points - {profile.points}
                    </h3>
                  ) : (
                    <Link to="/manage-family">
                      <button className="btn-small">MANAGE FAMILY</button>
                    </Link>
                  )}
                </div>

                <div className="py-2">
                  <button
                    className="btn-small"
                    onClick={() =>
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      })
                    }
                  >
                    LOGOUT?
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {/* <div className="flex items-center justify-center border border-4 border-white p-1 rounded-md ">
          <div className="flex flex-col items-center justify-center">
            <h2 className="mx-6">{profile.name}</h2>
            {!profile.is_parent ? (
              <h3 className="mx-6">Points - {profile.points}</h3>
            ) : (
              <Link to="/manage-family">
                <button className="btn-small">MANAGE FAMILY</button>
              </Link>
            )}
            <button
              className="btn-small"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              LOGOUT?
            </button>
          </div>
          <img src={profile.picture} alt={profile.name} className="w-24 mx-6" />
        </div> */}
      </>
    )
  }
}
