import { useAuth0 } from '@auth0/auth0-react'
import { getFamilyMembers, getUser } from '../apis/userApi'
import { useQuery } from '@tanstack/react-query'
import HomeProfile from './HomeProfile'
import { CompleteUser } from '@models/Iusers'

function Home() {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const {
    data: profile,
    error,
    isPending,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })

  const {
    data: familyData,
    error: errorfam,
    isPending: pendingfam,
  } = useQuery({
    queryKey: ['familymembers'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamilyMembers(accessToken)
    },
  })

  if (isPending) {
    return <p>Profile is loading...</p>
  }

  if (error) {
    const message = profile?.message
    return <div>{message}</div>
  }

  const parent = profile.profile?.is_parent

  if (parent) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h1>{`${profile.profile?.name}'s Family Status`}</h1>
        {familyData?.some((member) => !member.is_parent) ? (
          familyData?.map(
            (member) =>
              !member.is_parent && (
                <HomeProfile member={member} key={member.id} />
              )
          )
        ) : (
          <h2>{`Go get some kids ${profile.profile?.name}!`} </h2>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>{`${profile.profile?.name}'s Page!`}</h1>
      <HomeProfile member={profile.profile as CompleteUser} />
    </div>
  )
}

export default Home
