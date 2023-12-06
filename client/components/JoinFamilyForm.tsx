import { useState } from 'react'
import { joinFamily } from '../apis/family.ts'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'

const emptyForm = {
  name: '',
  password: '',
}

const JoinFamilyForm = () => {
  const [familyForm, setFamilyForm] = useState(emptyForm)
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigate('/')
    },
  })

  return (
    <>
      <div className="card-family-member mt-8">
        <form className="flex flex-col items-center justify-center">
          <h2>Join Family</h2>
          <label htmlFor="name" className="mt-8">
            Family Name
          </label>
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

          <button className="btn-primary text-center mt-8" onClick={formSubmit}>
            Join the family
          </button>
        </form>
        <span className="colour-border"></span>
      </div>
    </>
  )
}

export default JoinFamilyForm
