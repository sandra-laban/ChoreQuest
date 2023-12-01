import { useState } from 'react'
import CreateFamilyForm from './CreateFamilyForm'
import JoinFamilyForm from './JoinFamilyForm'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getUser } from '../apis/userApi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FamilyPage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const navigate = useNavigate()

  const { data, error, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })
  const [displayForm, setDisplayForm] = useState<string>('')

  const showJoinFamilyForm = () => {
    setDisplayForm('join')
  }

  const showCreateFamilyForm = () => {
    setDisplayForm('create')
  }

  if (isPending) {
    return <p>Profile is loading...</p>
  }
  if (error) {
    return <div>Oppps there has been an error</div>
  }

  if (!data.profile?.family_id) {
    return (
      <>
        <div className="flex flex-col items-center h-screen">
          <img
            src="images/chorequest.png"
            alt="ChoreQuest Logo"
            className="mx-auto w-1/3"
          />
          <div className="flex justify-center">
            <button className="btn-primary mx-8" onClick={showJoinFamilyForm}>
              Join Family
            </button>
            <button className="btn-primary mx-8" onClick={showCreateFamilyForm}>
              Create Family
            </button>
          </div>
          {displayForm === 'join' && <JoinFamilyForm />}
          {displayForm === 'create' && <CreateFamilyForm />}
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <img
        src="images/chorequest.png"
        alt="ChoreQuest Logo"
        className="mx-auto w-1/3"
      />
      <h1>Haywards </h1>
      <h2>Family Members:</h2>
      <ul>
        <li>
          {data.profile.name} points {data.profile.points}
        </li>
      </ul>
    </div>
  )
}
