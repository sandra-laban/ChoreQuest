import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../apis/userApi'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0()
  const navigate = useNavigate()
  console.log(user)

  const accessTokenPromise = getAccessTokenSilently()

  const { data, isPending, error } = useQuery({
    queryKey: ['profile'],

    queryFn: async () => {
      const token = await accessTokenPromise
      return await getUser(token)
    },
  })

  if (isPending) {
    return <p>Profile is loading...</p>
  }

  if (error) {
    console.error('Error fetching user:', error.message)
  }

  if (!isAuthenticated) {
    return (
      <>
        <img
          src="images/chorequest.png"
          alt="ChoreQuest Logo"
          className="mx-auto w-1/3"
        />
        <div className="text-center">
          <button className="btn-primary" onClick={() => loginWithRedirect()}>
            LOGIN / SIGN UP
          </button>
        </div>
      </>
    )
  } else navigate('/profile')
}

export default LandingPage
