import { getUser } from '../apis/userApi'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { id } = useParams()
  const {
    data: userData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id as unknown as number),
  })

  if (isError) {
    return <div>There was an error finding your profile</div>
  }

  if (!userData || isLoading) {
    return <p>Profile is loading...</p>
  }

  const user = userData

  return (
    <>
      <h1>{user.name}</h1>
      <img src={user.picture} alt={user.name} />
      <h2>Family - {user.familyName}</h2>
      <button>Edit</button>
      <button>Delete Profile</button>
    </>
  )
}
