import { useState } from 'react'
import '../styles/CreateFamilyForm.css'
import { joinFamily } from '../apis/Family'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

const emptyForm = {
  name: '',
  password: '',
}

const JoinFamilyForm = () => {
  const [familyForm, setFamilyForm] = useState(emptyForm)
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.target
    setFamilyForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const formSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    joinFamilyMutation.mutate()
  }

  const joinFamilyMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await getAccessTokenSilently()
      await joinFamily(familyForm, accessToken)
    },
    onSuccess: () => {
      // navigate('/')
    },
  })

  return (
    <>
      <form className="CreateFamilyFrom">
        <h2>Join Family</h2>
        <label htmlFor="name">Family Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={familyForm.name}
          onChange={handleChange}
        />

        <label htmlFor="password">Family Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={familyForm.password}
          onChange={handleChange}
        />

        <button onClick={formSubmit}>Join the family</button>
      </form>
    </>
  )
}

export default JoinFamilyForm
