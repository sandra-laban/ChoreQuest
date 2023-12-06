import { useQuery } from '@tanstack/react-query'
import { getUser } from '../apis/userApi'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { getAccessTokenSilently } = useAuth0()

  const accessTokenPromise = getAccessTokenSilently()

  const { data, error, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })

  if (isPending) {
    return <p>Profile is loading...</p>
  }

  if (error) {
    const message = data?.message
    return <div>{message}</div>
  }

  const profile = data?.profile

  if (profile && profile.family_id) {
    return (
      <>
        <div className="flex flex-col justify-center items-center">
          <div className="container px-4 py-8 mx-auto rounded-3xl bg-white h-18 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300 relative">
            <h1 className="main-title d-text">{profile.name}</h1>
            <div className="card-family-member flex justify-around">
              <div className="flex flex-col items-center justify-center py-6">
                <img src={profile.picture} alt={profile.name} />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-yellow-400 my-6">
                  Family - {profile.family?.name}
                </h2>
                {!profile.is_parent && (
                  <h2 className="text-yellow-400">Points - {profile.points}</h2>
                )}
              </div>
              <div className="flex flex-col items-center justify-center">
                <Link to="/profile/edit">
                  <button className="btn-primary">Edit Profile?</button>
                </Link>
              </div>
              <span className="colour-border"></span>
            </div>
          </div>
        </div>
      </>
    )
  }
}
