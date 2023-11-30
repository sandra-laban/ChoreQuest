import { useState } from 'react'
import '../styles/CreateFamilyForm.css'
import { joinFamily } from '../apis/Family'

const emptyForm = {
  name: '',
  password: '',
}

const JoinFamilyForm = () => {
  const [familyForm, setFamilyForm] = useState(emptyForm)

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
    await joinFamily(familyForm) 
    setFamilyForm(emptyForm)
  }

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
