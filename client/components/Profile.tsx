import { getUser } from '../apis/userApi'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import FamilyPage from './FamilyPage'

export default function Profile() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  const accessTokenPromise = getAccessTokenSilently()

  const { data, error, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })

  useEffect(() => {
    if (data?.message === 'Need to create profile') {
      navigate('/complete-profile')
      return
    }
  }, [isAuthenticated, data, navigate])

  if (isPending) {
    return <p>Profile is loading...</p>
  }

  if (error) {
    const message = data?.message
    return <div>{message}</div>
  }

  const profile = data?.profile

  if (profile && !profile.family_id) {
    return <FamilyPage />
  } else if (profile && profile.family_id) {
    return (
      <>
        <div className="flex flex-col items-center h-screen">
          <img
            src="images/chorequest.png"
            alt="ChoreQuest Logo"
            className="mx-auto w-1/3"
          />
          <h1>{profile.name}</h1>
          <img src={profile.picture} alt={profile.name} />
          <h2>Family - {profile.familyName}</h2>
        </div>
      </>
    )
  }
}
