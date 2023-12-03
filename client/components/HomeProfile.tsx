import { CompleteUser, User } from '@models/Iusers'

interface Props {
  member: User | CompleteUser
}
function HomeProfile({ member }: Props) {
  return (
    <>
      <div className="flex items-center justify-around border border-4 border-white p-1 rounded-md w-1/2 my-8">
        <div className="flex flex-col items-center justify-center my-6">
          <h3>{member.name}</h3>
          <img src={member.picture} alt={member.name} className="my-4" />
        </div>
        <div className="flex flex-col items-center justify-center my-6">
          <h3>Points - {member.points}</h3>
          <h3> CURRENT CHORE PLACEHOLDER - View Chores</h3>
          <h3> CURRENT GOAL PLACEHOLDER - View Prizes</h3>
        </div>
      </div>
    </>
  )
}

export default HomeProfile
