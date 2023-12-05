// import {getPrize} from '..'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { patchPrize } from '@/apis/prizes'
import { useNavigate, useParams } from 'react-router-dom'
import { getPrize } from '../apis/prizes'

export default function Prize() {
  const { user, getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [formView, setFormView] = useState(false)
  const queryClient = useQueryClient()

  const prizeId = useParams()
  console.log('TOKEN HERE')
  console.log(accessTokenPromise)
  console.log('PRIZE ID')
  console.log(prizeId.prize)
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

  if (isError) {
    return <div>There was an error getting the prize</div>
  }

  if (isLoading || !prize) {
    return <div>Loading the prize...</div>
  }

  return <div> PLACEHOLDER FOR PRIZE: {prize.name}</div>
}
