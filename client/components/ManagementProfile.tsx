import { makeParent, deleteUser } from '../apis/userApi'
import { User } from '@models/Iusers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

interface Props {
  member: User
}
function ManagementProfile({ member }: Props) {
  const { getAccessTokenSilently, user } = useAuth0()
  const queryClient = useQueryClient()
  const accessTokenPromise = getAccessTokenSilently()

  const makeParentMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await accessTokenPromise
      return await makeParent(accessToken, member.id as number)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familymembers'] })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await accessTokenPromise
      return await deleteUser(accessToken, member.id as number)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familymembers'] })
    },
  })

  function handleParentClick() {
    makeParentMutation.mutate()
  }

  function handleDeleteClick() {
    deleteUserMutation.mutate()
  }

  return (
    <>
      <div className="card-family-member">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <img src={member.picture} alt={member.name} className="my-4" />
            {member.is_parent ? (
              <h3 className="is-parent bg-purple-950 text-yellow-400 ml-5 p-2 rounded text-lg absolute top-0 right-0 w-20 text-center">
                Parent
              </h3>
            ) : (
              <h3 className="is-parent bg-purple-950 text-yellow-400 ml-5 p-2 rounded text-lg absolute top-0 right-0 w-20 text-center">
                Kid
              </h3>
            )}
          </div>
          <h3 className="text-white text-2xl font-bold pb-2">{member.name}</h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          {!member.is_parent && (
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
                    <path
                      fill="#FFF"
                      opacity=".25"
                      d="M7 8.8h10l-5 10.3z"
                    ></path>
                  </g>
                </svg>
              </span>
            </h3>
          )}
          <div className="flex items-center justify-center">
            {!member.is_parent && member.points === 0 ? (
              <button className="btn-small" onClick={handleParentClick}>
                Make Parent?
              </button>
            ) : null}
            {member.auth_id !== user?.sub ? (
              <button onClick={handleDeleteClick} className="btn-small">
                Delete User?
              </button>
            ) : null}
          </div>
        </div>
        <span className="colour-border"></span>
      </div>
    </>
  )
}

export default ManagementProfile
