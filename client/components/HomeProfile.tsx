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
      <div className="card-family-member">
        <div className="flex flex-col items-center justify-center">
          <h3>{member.name}</h3>
          <img src={member.picture} alt={member.name} className="my-4" />
        </div>
        <div className="flex flex-col items-center justify-center my-6 mx-8">
          <h3 className=" text-yellow-400 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 text-center">
            {member.points}
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
                  <path fill="#FFF" opacity=".25" d="M7 8.8h10l-5 10.3z"></path>
                </g>
              </svg>
            </span>
          </h3>
          <p> CURRENT CHORE </p>
          {member.currentChore?.name || member.chore_name ? (
            <h2 className="text-center my-3">
              {member.currentChore?.name}
              {member.chore_name}
            </h2>
          ) : (
            <h2>No current chore</h2>
          )}
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
          <p> CURRENT GOAL </p>
          {member.currentGoal?.name || member.goal_name ? (
            <h2 className="text-center my-3">
              {member.currentGoal?.name}
              {member.goal_name}
            </h2>
          ) : (
            <h2>No current goal</h2>
          )}
        </div>
        <span className="colour-border"></span>
      </div>
    </>
  )
}

export default HomeProfile
