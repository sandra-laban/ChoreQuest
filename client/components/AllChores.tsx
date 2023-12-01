import { useQuery } from '@tanstack/react-query'
import { getAllChores } from '../apis/chores'
import { DateTime } from 'luxon'
import AddChore from './AddChoreForm'

const ChoreList = () => {
  const {
    data: chores,
    isError,
    isLoading,
  } = useQuery({ queryKey: ['chores'], queryFn: getAllChores })
  console.log(chores)

  if (isError) {
    return <p>There was an error trying to load the chores!</p>
  }
  if (isLoading || !chores) {
    return <p>Loading chores...</p>
  }
  console.log(chores)
  //const choreDate = DateTime.fromMillis(chore.created)
  return (
    <>
      <div className="container px-4 mx-auto">
        <h1> All Chores</h1>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 mb-10">
          {chores?.map((chore) => (
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
              </li>
            </ul>
          ))}
        </div>
        <div className="grid md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 m-5 mb-10">
          <AddChore />
        </div>
      </div>
    </>
  )
}

export default ChoreList
