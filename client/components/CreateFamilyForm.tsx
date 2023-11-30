import { useState } from 'react'
import '../styles/CreateFamilyForm.css'
import { createFamily } from '../apis/Family'

const emptyForm = {
  name: '',
  password: '',
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
        <label htmlFor="name">Family Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={familyFrom.name}
          onChange={handleChange}
        />

        <label htmlFor="password">Family Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={familyFrom.password}
          onChange={handleChange}
        ></input>

        <button onClick={formSubmit}>Create your family</button>
      </form>
    </>
  )
}

export default CreateFamilyForm
