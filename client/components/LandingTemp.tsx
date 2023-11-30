import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '../apis/userApi'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()
  let registered = false
  let joinedFamily = false
  const {
    data: userData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(),
  })
  if (isError) {
    return <div>There was an error finding your profile</div>
  }

  if (!userData || isLoading) {
    return <p>Profile is loading...</p>
  }

  if (isAuthenticated) {
    registered = true
  }

  if (
    isAuthenticated &&
    !userData.some((profile) => profile.auth_id === user?.sub)
  ) {
    navigate('/complete-profile')
  }

  if (
    isAuthenticated &&
    userData.some(
      (profile) => profile.auth_id === user?.sub && profile.family_id === null
    )
  ) {
    joinedFamily = false
  }

  if (
    isAuthenticated &&
    userData.some(
      (profile) => profile.auth_id === user?.sub && profile.family_id !== null
    )
  ) {
    navigate('/home')
  }

  return (
    <>
      <div className="h-screen">
        <h1>ChoreQuest</h1>
        {!registered ? (
          <button onClick={() => loginWithRedirect()}>Login / Sign Up</button>
        ) : null}
        {registered && !joinedFamily ? (
          <div>
            <button>Join Family</button>
            <button>Create Family</button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default LandingPage
