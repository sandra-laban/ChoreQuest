import { deleteUser, getUser } from '../apis/userApi'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const { data, error, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return await getUser(accessToken)
    },
  })

  if (error) {
    const message = data?.message
    return <div>{message}</div>
  }

  if (isPending) {
    return <p>Profile is loading...</p>
  }

  if (data?.message === 'Need to create profile') {
    navigate('/complete-profile')
  }

  const profile = data.profile

  if (!isAuthenticated) {
    navigate('/home')
  }

  console.log(profile)
  if (profile && !profile.family_id) {
    return (
      <>
        <img
          src="images/chorequest.png"
          alt="ChoreQuest Logo"
          className="mx-auto w-1/3"
        />
        <div className="flex flex-col justify-center items-center h-screen">
          {profile && profile.family_id === null ? (
            <div className="flex justify-center">
              <button className="btn-primary mx-8">Join Family</button>
              <button className="btn-primary mx-8">Create Family</button>
            </div>
          ) : null}
        </div>
      </>
    )
  } else if (profile && profile.family_id) {
    return (
      <>
        <h1>{profile.name}</h1>
        <img src={profile.picture} alt={profile.name} />
        <h2>Family - {profile.familyName}</h2>
        <button onClick={() => navigate(`/profile/${Number(profile.id)}/edit`)}>
          Edit
        </button>
        {/* <button onClick={() => handleDeleteClick()}>Delete Profile</button> */}
      </>
    )
  }
}
