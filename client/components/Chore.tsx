import {
  makeParent,
  deleteUser,
  getFamilyMembers,
  getUser,
} from '../apis/userApi'
import { Chore } from '../../models/chores.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { DateTime } from 'luxon'
import {
  acceptChore,
  assignChore,
  completeChore,
  deleteChore,
  getFamilyChorelist,
  getFamilyChores,
  rejectChore,
  unassignChore,
  confirmChore,
} from '../apis/chores.ts'
import { ChangeEvent, useState } from 'react'
import { User } from '../../models/Iusers.ts'
import { socketInstance } from '../apis/websocket.ts'
import { AssignmentForm } from '../../models/Iforms.ts'

interface Props {
  chore: Chore
  completed?: boolean
}
function ChoreBox({ chore, completed }: Props) {
  const [assignView, setAssignView] = useState(false)
  const [selectedKid, setSelectedKid] = useState('')
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
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

  const handleAssignChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedKid(event.target.value)
  }

  function handleDeleteClick(choreId: number) {
    deleteChoreMutation.mutate(choreId)
  }

  function handleAcceptClick(choreId: number) {
    acceptChoreMutation.mutate(choreId)
  }

  function handleCompleteClick(choreId: number) {
    completeChoreMutation.mutate(choreId)
  }

  function handleConfirmClick(choreId: number) {
    confirmChoreMutation.mutate(choreId)
  }

  function handleRejectClick(choreId: number) {
    rejectChoreMutation.mutate(choreId)
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

  const deleteChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await deleteChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      socketInstance.emit('update_query_key', {
        queryKey: ['chores', 'notifications'],
        users: 'family',
        notificationMessage: 'Chore deleted',
      })
    },
  })

  const completeChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await completeChore(accessToken, choreId)
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({
        queryKey: ['chores', 'profile', 'chorelist'],
      })
      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'profile', 'chorelist'],
        users: 'parents',
        notificationMessage: 'Chore completed!',
      })
    },
  })

  const confirmChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await confirmChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['completedchores'] })
    },
  })

  const rejectChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await rejectChore(accessToken, choreId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['completedchores'] })
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
      queryClient.invalidateQueries({ queryKey: ['chores'] })
    },
  })

  if (error || profileError || choreError) {
    return <p>There was an error trying to load the chores!</p>
  }
  if (
    isPending ||
    !choreData ||
    profilePending ||
    !profile ||
    chorePending ||
    !choreList ||
    famPending ||
    !familydata
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
    <ul
      className="bg-white overflow-hidden m-5 hover:bg-blue-100 border border-gray-200 p-3 text-center"
      key={chore.id}
    >
      <li>
        <h2>Chore name: {chore.name}</h2>
        <p>Points: {chore.points}</p>
        <p>
          Due:{' '}
          {typeof chore.created === 'number'
            ? DateTime.fromMillis(chore.created).toISODate()
            : DateTime.fromISO(chore.created).toISODate()}
        </p>

        {profile.is_parent && !completed ? (
          <>
            <button
              onClick={() => handleDeleteClick(chore.id)}
              className="btn-primary hover:bg-red-500 bg-red-400 mb-12 items-center justify-center"
            >
              Delete
            </button>
            {!(
              choreList.find((item: any) => item.chores_id === chore.id) &&
              !(profile.currentChore?.chores_id === chore.id)
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
        {profile.is_parent && completed ? (
          <div>
            <button
              className="btn-small"
              onClick={() => handleRejectClick(chore.id)}
            >
              Reject!
            </button>
            <button
              className="btn-small"
              onClick={() => handleConfirmClick(chore.id)}
            >
              Mark Complete
            </button>
          </div>
        ) : null}
        {choreList.find((item: any) => item.chores_id === chore.id) &&
        !(profile.currentChore?.chores_id === chore.id) ? (
          <>
            <h3 className="text-red-600">{`Assigned to ${
              choreList?.find((item: any) => item.chores_id === chore.id)?.name
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
  )
}

export default ChoreBox
