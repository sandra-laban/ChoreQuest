import { getAllPrizes } from '../apis/prizes'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

import AddPrize from './AddPrize'
import { getUser } from '../apis/userApi'
import { useState } from 'react'

export default function AllPrizes() {
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
      return await getAllPrizes(token)
    },
  })

  const {
    data: profileData,
    error: profileError,
    isPending: profilePending,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })
  const profile = profileData?.profile

  if (isError || profileError) {
    return <div>There was an error getting your prizes</div>
  }

  if (isLoading || !allPrizes || profilePending || !profileData) {
    return <div>Loading your prizes...</div>
  }

  return (
    <>
      <div className="container px-4 mx-auto text-center">
        <h1 className="text-center">{profile?.family?.name} Family Prizes:</h1>
        <h2 className="text-center">What do you want for your points?</h2>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 mx-5 mb-10">
          {allPrizes.map((prize) => (
            <div
              key={prize.id}
              className="border-2 rounded-lg m-5 gap-3 text-center bg-sky-200"
            >
              <Link to={`/mngprizes/${prize.id}`}>
                <h2>Prize: {prize.name}</h2>
                <p>{prize.definition}</p>
                <p>Price: {prize.price}</p>
                <p>How many left: {prize.quantity}</p>
              </Link>
              {}
            </div>
          ))}
        </div>
        {profile?.is_parent ? (
          <button className="btn-primary">Add a Prize?</button>
        ) : null}
      </div>
    </>
  )
}
