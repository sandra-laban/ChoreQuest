import { useAuth0 } from '@auth0/auth0-react'
import {add}

export default function AddPrize() {
  const { user } = useAuth0()
  console.log(user)
  return <h2>Add a Prize!</h2>
}
