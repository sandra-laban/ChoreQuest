// import {getPrize} from '..'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { patchPrize } from '@/apis/prizes'

export default function Prize() {
  const { user, getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [formView, setFormView] = useState(false)
  const queryClient = useQueryClient()

  return <div> PLACEHOLDER FOR PRIZE</div>
}
