import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getFamilyMembers, getUser } from '../apis/userApi'
import ManagementProfile from './ManagementProfile'
import { getFamily } from '../apis/familyApi'
import { useState } from 'react'

function ManageFamily() {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [familyView, setFamilyView] = useState('View All')

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
    data: familyInfo,
    error: faminfoError,
    isPending: faminfoPending,
  } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamily(accessToken)
    },
  })

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

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setFamilyView(e.currentTarget.innerText)
  }

  const profile = userData?.profile
  const family = familyInfo?.family

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container px-4 py-8 mx-auto rounded-3xl bg-white h-18 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300 relative">
        <h1 className="main-title d-text">
          Manage {profile?.family?.name} Family
        </h1>

        {family?.picture !== null && (
          <img
            src={`images/familyIcons/${family?.picture}`}
            alt={family?.name}
          />
        )}

        <div className="flex justify-center items-center">
          <button className="btn-primary" onClick={handleClick}>
            View Parents
          </button>
          <button className="btn-primary" onClick={handleClick}>
            View Kids
          </button>
          <button className="btn-primary" onClick={handleClick}>
            View All
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-5 mb-10">
          {familyView === 'View All' &&
            sortedFamily?.map((member) => (
              <ManagementProfile member={member} key={member.id} />
            ))}
          {familyView === 'View Parents' &&
            sortedFamily?.map((member) =>
              member.is_parent ? (
                <ManagementProfile member={member} key={member.id} />
              ) : null
            )}
          {familyView === 'View Kids' &&
            sortedFamily?.map(
              (member) =>
                !member.is_parent && (
                  <ManagementProfile member={member} key={member.id} />
                )
            )}
        </div>
      </div>
    </div>
  )
}

export default ManageFamily
