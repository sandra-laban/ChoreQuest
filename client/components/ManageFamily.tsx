import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getFamilyMembers, getUser } from '../apis/userApi'
import ManagementProfile from './ManagementProfile'

function ManageFamily() {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()

  const {
    data: familydata,
    error,
    isPending,
  } = useQuery({
    queryKey: ['familymembers'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamilyMembers(accessToken)
    },
  })
  let sortedFamily

  const {
    data: userData,
    error: userError,
    isPending: userPending,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })

  if (isPending) {
    return <p>Family is loading...</p>
  }

  if (error) {
    return <h1>Error getting Family info</h1>
  } else {
    sortedFamily = [...familydata].sort((a, b) => {
      return b.is_parent ? 1 : -1
    })
  }

  const profile = userData?.profile
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Manage {profile?.family?.name} Family</h1>
      {sortedFamily?.map((member) => (
        <ManagementProfile member={member} key={member.id} />
      ))}
    </div>
  )
}

export default ManageFamily
