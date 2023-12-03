import { getUser } from '../apis/userApi'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
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

  const profile = data?.profile

  if (profile && !profile.family_id) {
    return null
  } else if (profile && profile.family_id) {
    return (
      <>
        <div className="flex items-center justify-center border border-4 border-white p-1 rounded-md ">
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
        </div>
      </>
    )
  }
}
