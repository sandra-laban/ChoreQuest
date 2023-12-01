import { useQuery } from '@tanstack/react-query'
import { getAllChores } from '../apis/chores'
import { DateTime } from 'luxon'
import { useNavigate } from 'react-router-dom'

const ChoreList = () => {
  const {
    data: chores,
    isError,
    isLoading,
  } = useQuery({ queryKey: ['chores'], queryFn: getAllChores })

  const navigate = useNavigate()
  if (isError) {
    return <p>There was an error trying to load the chores!</p>
  }
  if (isLoading || !chores) {
    return <p>Loading chores...</p>
  }
  function handleClick() {
    navigate('/prizes/add')
  }

  return (
    <>
      <h1> All Chores</h1>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 mb-10">
        {chores?.map((chore) => (
          <ul
            className="bg-white overflow-hidden hover:bg-blue-100 border border-gray-200 p-3 text-center"
            key={chore.id}
          >
            <li>
              <h2>Chore name: {chore.name}</h2>
              <p>Points: {chore.points}</p>
              <p>
                Created:{' '}
                {DateTime.fromMillis(Number(chore.created)).toISODate()}
              </p>
            </li>
          </ul>
        ))}
      </div>
      <button onClick={handleClick}>Add a Prize!</button>
    </>
  )
}

export default ChoreList
