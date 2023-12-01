import { useState } from 'react'
import CreateFamilyForm from './CreateFamilyForm'
import JoinFamilyForm from './JoinFamilyForm'

export default function FamilyPage() {
  const [displayForm, setDisplayForm] = useState<string>('')

  const showJoinFamilyForm = () => {
    setDisplayForm('join')
  }

  const showCreateFamilyForm = () => {
    setDisplayForm('create')
  }

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
