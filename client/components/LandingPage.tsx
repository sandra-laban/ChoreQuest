import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../apis/userApi'
import NewUserForm from './NewUserForm'
import FamilyPage from './FamilyPage'

function LandingPage() {
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0()
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

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && profile?.family_id) {
        navigate('/profile')
      }
    }
  }, [isLoading, isAuthenticated, navigate, profile?.family_id])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <div className="flex flex-col items-center  min-h-screen">
        <img
          src="images/chorequest.png"
          alt="ChoreQuest Logo"
          className="mx-auto w-1/3"
        />
        {!isAuthenticated && (
          <button className="btn-primary" onClick={() => loginWithRedirect()}>
            LOGIN / SIGN UP
          </button>
        )}
        {isAuthenticated && !profile ? <NewUserForm /> : null}
        {isAuthenticated && profile?.id && !profile?.family_id ? (
          <FamilyPage />
        ) : null}
      </div>
    </>
  )
}

export default LandingPage
