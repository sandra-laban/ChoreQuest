import { deleteUser, getUser } from '../apis/userApi'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    data: userData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id as unknown as number),
  })
  const queryClient = useQueryClient()
  const deleteProfileMutation = useMutation({
    mutationFn: () => deleteUser(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  async function handleDeleteClick() {
    await deleteProfileMutation.mutate()
    navigate('/login')
  }

  if (isError) {
    return <div>There was an error finding your profile</div>
  }

  if (!userData || isLoading) {
    return <p>Profile is loading...</p>
  }

  const profile = userData

  return (
    <>
      <h1>{profile.name}</h1>
      <img src={profile.picture} alt={profile.name} />
      <h2>Family - {profile.familyName}</h2>
      <button>Edit</button>
      <button onClick={() => handleDeleteClick()}>Delete Profile</button>
    </>
  )
}
