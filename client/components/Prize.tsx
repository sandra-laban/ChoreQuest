// import {getPrize} from '..'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { patchPrize } from '@/apis/prizes'
import { useNavigate, useParams } from 'react-router-dom'
import { getPrize } from '../apis/prizes'
import { getUser } from '../apis/userApi'

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

  if (isError || profileError) {
    return <div>There was an error getting the prize</div>
  }

  if (isLoading || !prize || profilePending || !profileData) {
    return <div>Loading the prize...</div>
  }

  return (
    <div className="border-2 rounded-lg m-5 gap-3 text-center bg-sky-200">
      <h2>Prize: {prize.name}</h2>
      <p>{prize.definition}</p>
      <p>Price: {prize.price}</p>
      <p>How many left: {prize.quantity}</p>
    </div>
  )
}
