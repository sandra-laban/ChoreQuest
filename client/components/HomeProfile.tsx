import { useAuth0 } from '@auth0/auth0-react'
import { completeChore } from '../apis/chores'
import { CompleteUser, User } from '@models/Iusers'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  member: CompleteUser
}

function HomeProfile({ member }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const queryClient = useQueryClient()

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

  function handleCompleteClick(choreId: number) {
    completeChoreMutation.mutate(choreId)
  }

  return (
    <>
      <div className="flex items-center justify-around border border-4 border-white p-1 rounded-md w-1/2 my-8">
        <div className="flex flex-col items-center justify-center my-6">
          <h3>{member.name}</h3>
          <img src={member.picture} alt={member.name} className="my-4" />
        </div>
        <div className="flex flex-col items-center justify-center my-6 mx-8">
          <h3>Points - {member.points}</h3>
          <h3> Current Chore - {member.currentChore?.name}</h3>
          {member.currentChore ? (
            <button
              className="btn-small"
              onClick={() =>
                handleCompleteClick(member.currentChore?.chores_id as number)
              }
            >
              Complete?
            </button>
          ) : null}
          <h3> Current Goal - {member.currentGoal?.name}</h3>
        </div>
      </div>
    </>
  )
}

export default HomeProfile
