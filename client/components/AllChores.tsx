import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptChore,
  deleteChore,
  getFamilyChores,
  getFamilyChorelist,
  completeChore,
  unassignChore,
  assignChore,
} from '../apis/chores'
import { DateTime } from 'luxon'
import AddChore from './AddChoreForm'
import { useAuth0 } from '@auth0/auth0-react'
import { socketInstance } from '../apis/websocket'
import { getFamilyMembers, getUser } from '../apis/userApi'
import { ChangeEvent, FormEvent, useState } from 'react'
import { AssignedChore, Chore } from '@models/chores'
import { User } from '@models/Iusers'
import { AssignmentForm } from '@models/Iforms'

const ChoreList = () => {
  const [formView, setFormView] = useState(false)
  const [assignView, setAssignView] = useState(false)
  const [selectedKid, setSelectedKid] = useState('')
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
    data: familydata,
    error: famError,
    isPending: famPending,
  } = useQuery({
    queryKey: ['familymembers'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getFamilyMembers(accessToken)
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

  const deleteChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await deleteChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      socketInstance.emit('update_query_key', {
        queryKey: ['chores', 'notifications'],
        users: 'all',
        notificationMessage: 'Chore deleted',
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

  const assignChoreMutation = useMutation({
    mutationFn: async (currentForm: AssignmentForm) => {
      const accessToken = await accessTokenPromise
      return await assignChore(accessToken, currentForm)
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

  async function handleAssignment(choreId: number) {
    const currentForm = {
      kid: selectedKid,
      choreId: choreId,
    }
    await assignChoreMutation.mutate(currentForm)
    setAssignView(false)
  }

  const handleAssignChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedKid(event.target.value)
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

  const availableKids = familydata?.filter(
    (user) =>
      !user.is_parent &&
      !choreList.some((excludedUser: User) => excludedUser.name === user.name)
  )

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
                  <>
                    <button
                      onClick={() => handleDeleteClick(chore.id)}
                      className="btn-primary hover:bg-red-500 bg-red-400 mb-12 items-center justify-center"
                    >
                      Delete
                    </button>
                    {!(
                      choreList.find(
                        (item: any) => item.chores_id === chore.id
                      ) && !(profile.currentChore?.chores_id === chore.id)
                    ) ? (
                      <button
                        className="btn-small"
                        onClick={() => setAssignView(!assignView)}
                      >
                        Assign to:
                      </button>
                    ) : null}
                    {assignView ? (
                      <>
                        <input
                          type="text"
                          id="kid"
                          name="kid"
                          list="kidSuggestions"
                          onChange={handleAssignChange}
                        />
                        <datalist id="kidSuggestions">
                          {availableKids?.map((kid) => (
                            <option key={kid.id} value={kid.name} />
                          ))}
                        </datalist>
                        <button
                          className="btn-small"
                          onClick={() => handleAssignment(chore.id)}
                        >
                          Confirm
                        </button>
                      </>
                    ) : null}
                  </>
                ) : null}
                {choreList.find((item: any) => item.chores_id === chore.id) &&
                !(profile.currentChore?.chores_id === chore.id) ? (
                  <>
                    <h3 className="text-red-600">{`Assigned to ${
                      choreList?.find(
                        (item: any) => item.chores_id === chore.id
                      )?.name
                    }`}</h3>
                    {profile.is_parent ? (
                      <button
                        className="btn-small"
                        onClick={() => handleRemoveClick(chore.id)}
                      >
                        Unassign
                      </button>
                    ) : null}
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
