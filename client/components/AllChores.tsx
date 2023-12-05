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
import ChoreBox from './Chore'

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
            <ChoreBox chore={chore} key={chore.id} />
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
