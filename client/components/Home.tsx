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

  const { data: familyData } = useQuery({
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
        <div className="container px-4 py-8 mx-auto rounded-3xl bg-white h-18 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300 relative">
          <h1 className="main-title d-text">{`${profile.profile?.name}'s Kids' Status`}</h1>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-5 mb-10">
            {familyData?.some((member) => !member.is_parent) ? (
              familyData?.map(
                (member) =>
                  !member.is_parent && (
                    <HomeProfile member={member} key={member.id} />
                  )
              )
            ) : (
              <h2 className="main-title d-text">
                {`Go get some kids ${profile.profile?.name}!`}{' '}
              </h2>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container px-4 py-8 mx-auto rounded-3xl bg-white h-18 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300 relative">
        <h1 className="main-title d-text">{`${profile.profile?.name}'s Page!`}</h1>
        <HomeProfile member={profile.profile as CompleteUser} />
      </div>
    </div>
  )
}

export default Home
