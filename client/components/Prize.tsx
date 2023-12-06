// import {getPrize} from '..'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPrize, patchPrize, claimPrize } from '../apis/prizes'
import { getUser, setGoal } from '../apis/userApi'

export default function Prize() {
  const { user, getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [formView, setFormView] = useState(false)
  const queryClient = useQueryClient()

  const prizeId = useParams()

  const {
    data: prize,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['prize', prizeId],
    queryFn: async () => {
      const token = await accessTokenPromise
      return await getPrize(prizeId.prize as string, token)
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

  const claimPrizeMutation = useMutation({
    mutationFn: async (prizeId: number) => {
      const accessToken = await accessTokenPromise
      return await claimPrize(accessToken, prizeId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
      queryClient.invalidateQueries({ queryKey: ['prize', prizeId] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const chooseGoalMutation = useMutation({
    mutationFn: async (prizeId: number) => {
      const accessToken = await accessTokenPromise
      return await setGoal(accessToken, prizeId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prize', prizeId] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  if (isError || profileError) {
    return <h1 className="text-center">None left!</h1>
  }

  if (isLoading || !prize || profilePending || !profileData) {
    return <div>Loading the prize...</div>
  }

  function handleClaimClick(prizeId: number) {
    claimPrizeMutation.mutate(prizeId)
  }

  function handleGoalClick(prizeId: number) {
    chooseGoalMutation.mutate(prizeId)
  }

  if (prize.quantity < 1) return <h1 className="text-center">None left!</h1>

  return (
    <div className="card-family-member w-1/2 mx-auto flex flex-col justify-center">
      <span className="gift-svg"></span>
      <h2 className="text-center mt-6">{prize.name}</h2>
      <p className="text-center mt-4 text-xl text-yellow-400">
        {prize.definition}
      </p>
      <p className="text-center mt-3 text-2xl">Price: {prize.price}</p>
      <p className="text-center mt-3 text-2xl"> Only {prize.quantity} Left!</p>
      {!profile?.is_parent &&
      profile?.points &&
      profile?.points >= prize.price ? (
        <button
          onClick={() => {
            handleClaimClick(prize.id)
          }}
          className="btn-primary my-6 w-2/3 mx-auto"
        >
          Claim Prize!
        </button>
      ) : null}
      {!profile?.is_parent && !(profile?.currentGoal?.id === prize.id) ? (
        <button
          onClick={() => {
            handleGoalClick(prize.id)
          }}
          className="btn-primary mb-4 w-2/3 mx-auto"
        >
          Set as Goal!
        </button>
      ) : null}
      <span className="colour-border"></span>
    </div>
  )
}
