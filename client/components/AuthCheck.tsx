import { useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { ReactElement, useEffect } from 'react'
import { getUser } from '../apis/userApi'

interface AuthCheckProps {
  element: ReactElement // Use ReactElement type for the element prop
}

function AuthCheck({ element }: AuthCheckProps): ReactElement {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const accessTokenPromise = getAccessTokenSilently()

  const { data, error, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })
  const profile = data?.profile

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !profile || !profile.family_id) {
        navigate('/')
      }
    }
  })

  if (isPending || isLoading) {
    return <p>Loading...</p>
  }

  return element
}

export default AuthCheck
