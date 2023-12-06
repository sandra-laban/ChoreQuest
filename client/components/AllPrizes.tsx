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
      <div className="container px-4 py-8 mx-auto rounded-3xl bg-white h-18 z-10 shadow-2xl bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-gray-300">
        <h1 className="main-title d-text">
          {profile?.family?.name} Family Prizes:
        </h1>
        <h2 className="text-center text-purple-950 mt-4 mb-8 text-3xl">
          What awesome reward would you like to redeem with your points?
        </h2>

        <div className="grid gap-4 sm:grid-col-1  md:grid-cols-2 lg:grid-cols-3 mx-5 mb-10 text-white">
          {allPrizes
            .filter((prize) => prize.quantity > 0)
            .map((prize) => (
              <div key={prize.id} className="card-chore">
                <div className="flex flex-col absolute top-0 right-0 h-24 w-24 bg-purple-950 justify-center rounded-bl-lg rounded-tr-lg">
                  <span className="gift-svg content-center"></span>
                  <span className="points-fixed">{prize.quantity}</span>
                </div>

                <Link to={`/mngprizes/${prize.id}`}>
                  <h2 className="text-white text-2xl font-bold pb-2 w-4/5">
                    {prize.name}
                  </h2>
                  <p className="text-white text-base pb-2 w-4/5">
                    {prize.definition}
                  </p>
                  <h3 className="text-yellow-400 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 text-center w-1/3">
                    <span className="svg-icon">
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="none" fillRule="evenodd">
                          <path
                            fill="#24CC8F"
                            d="M0 9l5-7h14l5 7-12 13z"
                          ></path>
                          <path
                            fill="#FFF"
                            opacity=".25"
                            d="M7 8.8L6 4h6zM17 8.8L18 4h-6z"
                          ></path>
                          <path
                            fill="#FFF"
                            opacity=".5"
                            d="M7 8.8L12 4l5 4.8zM2.6 8.8L6 4l1 4.8z"
                          ></path>
                          <path
                            fill="#34313A"
                            opacity=".11"
                            d="M21.4 8.8L18 4l-1 4.8zM2.6 8.8H7l5 10.3z"
                          ></path>
                          <path
                            fill="#FFF"
                            opacity=".5"
                            d="M21.4 8.8H17l-5 10.3z"
                          ></path>
                          <path
                            fill="#FFF"
                            opacity=".25"
                            d="M7 8.8h10l-5 10.3z"
                          ></path>
                        </g>
                      </svg>
                    </span>
                    {prize.price}
                  </h3>
                </Link>
                {}
                <span className="colour-border"></span>
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
