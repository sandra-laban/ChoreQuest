// import {getPrize} from '..'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

export default function Prize() {
  const { user, getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  return <div> PLACEHOLDER FOR PRIZE</div>
}
