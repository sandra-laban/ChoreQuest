import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers, getUser } from '../apis/userApi'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0()
  const navigate = useNavigate()
  console.log(user)
  const registered = false
  const joinedFamily = false
  const {
    data: userData,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      await getUser(token)
    },
  })

  // if (isError) {
  //   return <div>There was an error finding your profile</div>
  // }

  // if (isLoading) {
  //   return <p>Profile is loading...</p>
  // }

  // if (isAuthenticated) {
  //   registered = true
  // }

  // if (
  //   isAuthenticated &&
  //   userData.some(
  //     (profile) => profile.auth_id === user?.sub && profile.family_id === null
  //   )
  // ) {
  //   joinedFamily = false
  // }

  // if (
  //   isAuthenticated &&
  //   !userData.some((profile) => profile.auth_id === user?.sub)
  // ) {
  //   navigate('/complete-profile')
  // }
  // if (
  //   isAuthenticated &&
  //   userData.some(
  //     (profile) => profile.auth_id === user?.sub && profile.family_id !== null
  //   )
  // ) {
  //   navigate('/home')
  // }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <img
          src="images/chorequest.png"
          alt="ChoreQuest Logo"
          className="mx-auto w-1/3"
        />
        {!userData || isError ? (
          <div className="text-center">
            <button className="btn-primary" onClick={() => loginWithRedirect()}>
              LOGIN / SIGN UP
            </button>
          </div>
        ) : null}
        {userData && userData[0].family_id === null ? (
          <div className="flex justify-center">
            <button className="btn-primary mx-8">Join Family</button>
            <button className="btn-primary mx-8">Create Family</button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default LandingPage
