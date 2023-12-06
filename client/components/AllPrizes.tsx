import { deliverPrize, getAllPrizes, getRecentClaims } from '../apis/prizes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

import AddPrize from './AddPrize'
import { getUser } from '../apis/userApi'
import { useState } from 'react'
import { Delivery } from '../../models/prizes'

export default function AllPrizes() {
  const [formView, setFormView] = useState(false)
  const [claimsView, setClaimsView] = useState(false)
  const { user, getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const queryClient = useQueryClient()

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
    data: recentClaims,
    isError: claimError,
    isLoading: claimLoading,
  } = useQuery({
    queryKey: ['claimedprizes'],
    queryFn: async () => {
      const token = await accessTokenPromise
      return await getRecentClaims(token)
    },
  })

  console.log('recent claims', recentClaims)

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

  const deliverPrizeMutation = useMutation({
    mutationFn: async (delivery: Delivery) => {
      const accessToken = await accessTokenPromise
      return await deliverPrize(accessToken, delivery)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      queryClient.invalidateQueries({ queryKey: ['claimedprizes'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  if (isError || profileError) {
    return <div>There was an error getting your prizes</div>
  }

  if (isLoading || !allPrizes || profilePending || !profileData) {
    return <div>Loading your prizes...</div>
  }

  function handleDeliverClick(prizeId: number, assigned: number) {
    const delivery = {
      prizeId: prizeId,
      assigned: assigned,
    }
    deliverPrizeMutation.mutate(delivery)
  }

  return (
    <>
      <div className="container px-4 mx-auto text-center">
        <h1 className="text-center">{profile?.family?.name} Family Prizes:</h1>
        <h2 className="text-center">What do you want for your points?</h2>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 mx-5 mb-10">
          {allPrizes
            .filter((prize) => prize.quantity > 0)
            .map((prize) => (
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
          <div>
            <button className="btn-primary" onClick={() => setFormView(true)}>
              Add a Prize?
            </button>
            <button
              className="btn-primary"
              onClick={() => setClaimsView(!claimsView)}
            >
              Recently Claimed
            </button>
          </div>
        ) : null}
        {formView ? <AddPrize setFormView={setFormView} /> : null}
        {claimsView
          ? recentClaims.map((claim: any) => (
              <div
                key={claim.assigned}
                className="border-2 rounded-lg m-5 gap-3 text-center bg-sky-200"
              >
                <h2>Prize: {claim.name}</h2>
                <p>{claim.definition}</p>
                <p>Claimed by: {claim.user_name}</p>
                <button
                  onClick={() => handleDeliverClick(claim.id, claim.assigned)}
                  className="btn-small"
                >
                  Delivered?
                </button>
              </div>
            ))
          : null}
      </div>
    </>
  )
}
