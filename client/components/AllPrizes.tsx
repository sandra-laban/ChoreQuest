import { getAllPrizes } from '../apis/prizes'
import { useQuery } from '@tanstack/react-query'

export default function AllPrizes() {
  const {
    data: allPrizes,
    isError,
    isLoading,
  } = useQuery({ queryKey: ['prizes'], queryFn: getAllPrizes })
  if (isError) {
    return <div>There was an error getting your prizes</div>
  }
  if (isLoading) {
    return <div>Loading your prizes...</div>
  }
  return (
    <>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 mx-5 mb-10">
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
