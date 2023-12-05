import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptChore,
  deleteChore,
  getFamilyChores,
  getFamilyChorelist,
  completeChore,
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
      <div className="container px-4 mx-auto">
        <h1 className="main-title">{profile.family?.name} Family Chores</h1>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-5 mb-10">
          {choreData?.map((chore: Chore) => (
            <ul className="card-chore" key={chore.id}>
              <div className="flex flex-col absolute top-0 right-0 h-24 w-24 bg-purple-950 justify-center rounded-bl-lg rounded-tr-lg">
                <span className="svg-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                      <path fill="#24CC8F" d="M0 9l5-7h14l5 7-12 13z"></path>
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
                <span className="points-fixed">{chore.points}</span>
              </div>
              <span className="colour-border"></span>
              <li>
                <div className="my-4">
                  <h2 className="text-white text-2xl font-bold pb-2 w-4/5">
                    {chore.name}
                  </h2>
                  <p className="text-gray-300 py-1">
                    Due:{' '}
                    {typeof chore.created === 'number'
                      ? DateTime.fromMillis(chore.created).toISODate()
                      : DateTime.fromISO(chore.created).toISODate()}
                  </p>
                </div>
                {profile.is_parent ? (
                  <button
                    onClick={() => handleDeleteClick(chore.id)}
                    className="btn-primary"
                  >
                    Delete
                  </button>
                ) : null}
                {choreList.find((item: any) => item.chores_id === chore.id) &&
                !(profile.currentChore?.chores_id === chore.id) ? (
                  <h3 className="text-red-600">{`Assigned to ${
                    choreList?.find((item: any) => item.chores_id === chore.id)
                      ?.name
                  }`}</h3>
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
                    className="btn-primary"
                  >
                    Do it!
                  </button>
                ) : null}
              </li>
            </ul>
          ))}
        </div>
        {profile.is_parent ? (
          <div className="flex justify-center">
            <button className="btn-primary" onClick={() => setFormView(true)}>
              Add Chore?
            </button>
          </div>
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
