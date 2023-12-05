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
        <div className="flex flex-col items-center h-screen">
          <h1>{profile.name}</h1>
          <img src={profile.picture} alt={profile.name} />
          <h2>Family - {profile.family?.name}</h2>
          <Link to="/profile/edit">
            <button className="btn-primary">Edit Profile?</button>
          </Link>
        </div>
      </>
    )
  }
}
