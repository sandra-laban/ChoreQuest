import { useState } from 'react'
import '../styles/CreateFamilyForm.css'
import { createFamily } from '../apis/Family'

const emptyForm = {
  familyName: '',
  familyPassword: '',
}

const CreateFamilyForm = () => {
  const [familyFrom, setFamilyForm] = useState(emptyForm)

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
    await createFamily(familyFrom)
    setFamilyForm(emptyForm)
  }

  return (
    <>
      <form className="CreateFamilyFrom">
        <h2>Create Family</h2>
        <label htmlFor="familyName">Family Name</label>
        <input
          type="text"
          name="familyName"
          id="familyName"
          value={familyFrom.familyName}
          onChange={handleChange}
        />

        <label htmlFor="familyPassword">Family Password</label>
        <input
          type="password"
          name="familyPassword"
          id="familyPassword"
          value={familyFrom.familyPassword}
          onChange={handleChange}
        ></input>

        <button onClick={formSubmit}>Create your family</button>
      </form>
    </>
  )
}

export default CreateFamilyForm
