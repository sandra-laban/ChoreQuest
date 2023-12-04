import { getAllPrizes } from '../apis/prizes'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router-dom'

export default function AllPrizes() {
  // const { family } = useParams()
  const { user, getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const {
    data: allPrizes,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['prizes'],
    queryFn: async () => {
      const token = await accessTokenPromise
      getAllPrizes(token)
    },
  })

  console.log(user)
  console.log(allPrizes)
  // console.log(family)

  if (isError) {
    return <div>There was an error getting your prizes</div>
  }

  if (isLoading || !allPrizes) {
    return <div>Loading your prizes...</div>
  }
  return (
    <>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 mx-5 mb-10">
        <h2>All Prizes</h2>
        {allPrizes.map((prize) => (
          <div
            key={prize.id}
            className="border-2 m-5 gap-3 text-center bg-sky-200"
          >
            <h2>Prize: {prize.name}</h2>
            <p>Price: {prize.price}</p>
            <p>How many left: {prize.quantity}</p>
          </div>
        ))}
      </div>
    </>
  )
}
