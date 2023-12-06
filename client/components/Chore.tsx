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
        notificationMessage: null,
        pageUrl: null,
      })
    },
  })

  const completeChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await completeChore(accessToken, choreId)
    },
    onSuccess: ({ chore, user }: { chore: any; user: any }) => {
      queryClient.invalidateQueries({
        queryKey: ['chorelist'],
      })
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      })
      queryClient.invalidateQueries({
        queryKey: ['chores'],
      })
      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'profile', 'chorelist'],
        users: 'parents',
        notificationMessage: `${chore.name} completed by ${user.name}!`,
        pageUrl: '/chores',
      })
    },
  })

  const confirmChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await confirmChore(accessToken, choreId)
    },
    onSuccess: ({ chore, user }: { chore: any; user: any }) => {
      queryClient.invalidateQueries({
        queryKey: ['chores'],
      })
      queryClient.invalidateQueries({
        queryKey: ['completedchores'],
      })
      queryClient.invalidateQueries({
        queryKey: ['chorelist'],
      })
      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'profile', 'chorelist'],
        users: user.id,
        notificationMessage: `${chore.name} completed you got ${chore.points} points!`,
        pageUrl: '/profile',
      })
    },
  })

  const rejectChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const accessToken = await accessTokenPromise
      return await rejectChore(accessToken, choreId)
    },
    onSuccess: ({ chore, user }: { chore: any; user: any }) => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['completedchores'] })
      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'completedchores', 'chorelist'],
        users: user.id,
        notificationMessage: `${chore.name} not completed to standard`,
        pageUrl: '/chores',
      })
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
      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'profile', 'chorelist'],
        users: 'family',
        notificationMessage: null,
        pageUrl: null,
      })
    },
  })

  const assignChoreMutation = useMutation({
    mutationFn: async (currentForm: AssignmentForm) => {
      const accessToken = await accessTokenPromise
      return await assignChore(accessToken, currentForm)
    },
    onSuccess: ({ chore, user }: { chore: any; user: any }) => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.invalidateQueries({ queryKey: ['chorelist'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })

      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'profile', 'chorelist'],
        users: user.id,
        notificationMessage: `${chore.name} has been assigned to you`,
        pageUrl: '/chores',
      })
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
      socketInstance.emit('update_query_key', {
        queryKey: ['notifications', 'chores', 'profile', 'chorelist'],
        users: 'family',
        notificationMessage: null,
        pageUrl: null,
      })
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

  const availableKids = familydata?.filter(
    (user) =>
      !user.is_parent &&
      !choreList.some((excludedUser: User) => excludedUser.name === user.name)
  )

  return (
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
              <path fill="#FFF" opacity=".5" d="M21.4 8.8H17l-5 10.3z"></path>
              <path fill="#FFF" opacity=".25" d="M7 8.8h10l-5 10.3z"></path>
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

        {profile.is_parent && !completed ? (
          <>
            <button
              onClick={() => handleDeleteClick(chore.id)}
              className="btn-primary mx-4"
            >
              Delete
            </button>
            {!(
              choreList.find((item: any) => item.chores_id === chore.id) &&
              !(profile.currentChore?.chores_id === chore.id)
            ) ? (
              <button
                className="btn-primary"
                onClick={() => setAssignView(!assignView)}
              >
                Assign to:
              </button>
            ) : null}
            {assignView ? (
              <div className="flex flex-col justify-center w-1/2 mx-auto">
                <input
                  type="text"
                  id="kid"
                  name="kid"
                  list="kidSuggestions"
                  onChange={handleAssignChange}
                  className="mt-4"
                />
                <datalist id="kidSuggestions">
                  {availableKids?.map((kid) => (
                    <option key={kid.id} value={kid.name} />
                  ))}
                </datalist>
                <button
                  className="btn-primary mt-4"
                  onClick={() => handleAssignment(chore.id)}
                >
                  Confirm
                </button>
              </div>
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
            <h3 className="text-yellow-400 text-base my-4">{`Assigned to ${
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
