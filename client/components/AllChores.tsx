import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptChore,
  deleteChore,
  getFamilyChores,
  getFamilyChorelist,
  completeChore,
  unassignChore,
} from '../apis/chores'
import { DateTime } from 'luxon'
import AddChore from './AddChoreForm'
import { useAuth0 } from '@auth0/auth0-react'
import { getUser } from '../apis/userApi'
import { useState } from 'react'

import { socketInstance } from '../apis/websocket'

import { AssignedChore, Chore } from '@models/chores'


const ChoreList = () => {
  const [formView, setFormView] = useState(false)
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const queryClient = useQueryClient()

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

  console.log('chore data', choreData)

  const {
    data: choreList,
    error: choreError,
    isPending: chorePending,
  } = useQuery({
    queryKey: ['chorelist'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamilyChorelist(accessToken)
    },
  })
  console.log('allchores', choreList)

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

  const deleteChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await deleteChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      socketInstance.emit('update_query_key', {
        queryKey: ['chores'],
        users: 'all',
        notificationMessage: 'Chore added',
      })
    },
  })

  const completeChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await completeChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const unassignChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await unassignChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const acceptChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await acceptChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  function handleDeleteClick(choreId: number) {
    deleteChoreMutation.mutate(choreId)
  }

  function handleAcceptClick(choreId: number) {
    acceptChoreMutation.mutate(choreId)
  }

  function handleCompleteClick(choreId: number) {
    completeChoreMutation.mutate(choreId)
  }

  function handleRemoveClick(choreId: number) {
    unassignChoreMutation.mutate(choreId)
  }

  if (error || profileError || choreError) {
    return <p>There was an error trying to load the chores!</p>
  }
  if (
    isPending ||
    !choreData ||
    profilePending ||
    !profile ||
    chorePending ||
    !choreList
  ) {
    return <p>Loading chores...</p>
  }
  //const choreDate = DateTime.fromMillis(chore.created)

  return (
    <>
      <div className="container px-4 mx-auto text-center">
        <h1>{profile.family?.name} Family Chores</h1>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 mb-10">
          {choreData?.map((chore: Chore) => (
            <ul
              className="bg-white overflow-hidden m-5 hover:bg-blue-100 border border-gray-200 p-3 text-center"
              key={chore.id}
            >
              <li>
                <h2>Chore name: {chore.name}</h2>
                <p>Points: {chore.points}</p>
                <p>
                  Created:{' '}
                  {typeof chore.created === 'number'
                    ? DateTime.fromMillis(chore.created).toISODate()
                    : DateTime.fromISO(chore.created).toISODate()}
                </p>

                {profile.is_parent ? (
                  <button
                    onClick={() => handleDeleteClick(chore.id)}
                    className="btn-primary hover:bg-red-500 bg-red-400 mb-12 items-center justify-center"
                  >
                    Delete
                  </button>
                ) : null}
                {choreList.find((item: any) => item.chores_id === chore.id) &&
                !(profile.currentChore?.chores_id === chore.id) ? (
                  <>
                    <h3 className="text-red-600">{`Assigned to ${
                      choreList?.find(
                        (item: any) => item.chores_id === chore.id
                      )?.name
                    }`}</h3>
                    <button
                      className="btn-small"
                      onClick={() => handleRemoveClick(chore.id)}
                    >
                      Unassign
                    </button>
                  </>
                ) : null}
                {profile.currentChore?.chores_id === chore.id ? (
                  <>
                    <h3 className="text-green-600">Accepted</h3>
                    <button
                      onClick={() => handleCompleteClick(chore.id)}
                      className="btn-small"
                    >
                      Complete?
                    </button>
                  </>
                ) : null}
                {!choreList.find((item: any) => item.chores_id === chore.id) &&
                !profile.currentChore &&
                !profile.is_parent ? (
                  <button
                    onClick={() => handleAcceptClick(chore.id)}
                    className="btn-primary hover:bg-cyan-500 bg-cyan-400 mb-12 items-center justify-center"
                  >
                    Do it!
                  </button>
                ) : null}
              </li>
            </ul>
          ))}
        </div>
        {profile.is_parent ? (
          <button className="btn-primary" onClick={() => setFormView(true)}>
            Add Chore?
          </button>
        ) : // <div className="grid md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 m-5 mb-10">
        //   <AddChore />
        // </div>
        null}
        {formView ? <AddChore setFormView={setFormView} /> : null}
      </div>
    </>
  )
}

export default ChoreList
