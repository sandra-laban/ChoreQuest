import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function LandingPage() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/profile')
      }
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!isAuthenticated) {
    return (
      <>
        <img
          src="images/chorequest.png"
          alt="ChoreQuest Logo"
          className="mx-auto w-1/3 flex flex-col items-center justify-center"
        />
        <div className="text-center">
          <button className="btn-primary" onClick={() => loginWithRedirect()}>
            LOGIN / SIGN UP
          </button>
        </div>
      </>
    )
  }

  return null
}

export default LandingPage
