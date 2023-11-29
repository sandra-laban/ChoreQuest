import { useQuery } from '@tanstack/react-query'
import { getAllChores } from '../apis/chores'

const ChoreList = () => {
  const {
    data: chores,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chores'],
    queryFn: getAllChores,
  })

  if (error) {
    return <p>There was an error trying to load the chores!</p>
  }
  if (!chores || isLoading) {
    return <p>Loading chores...</p>
  }

  return (
    <>
      <h1> All Chores</h1>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 m-5 mb-10">
        <ul className="bg-white overflow-hidden hover:bg-blue-100 border border-gray-200 p-3 text-center">
          <li>
            <h2>Chore: Chore name</h2>
            <p>Description: chore description</p>
            <p>Assinge to: Kid name</p>
            <p>Status: ?</p>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ChoreList
