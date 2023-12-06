import { useQuery } from '@tanstack/react-query'
import { getFamilyChores, getFamilyRecents } from '../apis/chores'

import AddChore from './AddChoreForm'
import { useAuth0 } from '@auth0/auth0-react'

import ChoreBox from './Chore'
import { useState } from 'react'
import { getUser } from '../apis/userApi'
import { Chore } from '../../models/chores'

const ChoreList = () => {
  const [formView, setFormView] = useState(false)
  const [recentsView, setRecentsView] = useState(false)
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()

  const {
    data: choreData,
    error,
    isPending,
  } = useQuery({
    queryKey: ['chores'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamilyChores(accessToken)
    },
  })

  const {
    data: recentsData,
    error: recentsError,
    isPending: recentsPending,
  } = useQuery({
    queryKey: ['completedchores'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamilyRecents(accessToken)
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

  if (error || profileError) {
    return <p>There was an error trying to load the chores!</p>
  }
  if (isPending || !choreData || profilePending || !profile) {
    return <p>Loading chores...</p>
  }

  return (
    <>
      <div className="container px-4 mx-auto text-center">
        <h1>{profile?.family?.name} Family Chores</h1>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 mb-10">
          {choreData?.map((chore: Chore) => (
            <ChoreBox chore={chore} key={chore.id} />
          ))}
        </div>
        {profile?.is_parent ? (
          <div>
            <button
              className="btn-primary"
              onClick={() => setFormView(!formView)}
            >
              Add Chore?
            </button>
            <button
              className="btn-primary"
              onClick={() => setRecentsView(!recentsView)}
            >
              Recently Completed{' '}
            </button>
          </div>
        ) : // <div className="grid md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 m-5 mb-10">
        //   <AddChore />
        // </div>
        null}
        {formView ? <AddChore setFormView={setFormView} /> : null}
        {recentsView ? (
          <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 mb-10">
            {recentsData?.map((chore: Chore) => (
              <ChoreBox chore={chore} key={chore.id} completed={true} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}

export default ChoreList
