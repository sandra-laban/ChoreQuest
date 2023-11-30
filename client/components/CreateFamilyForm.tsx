import { useState } from 'react'
import '../styles/CreateFamilyForm.css'
import { createFamily } from '../apis/Family'

const emptyForm = {
  name: '',
  password: '',
  image: null,
}

const CreateFamilyForm = () => {
  const [familyFrom, setFamilyForm] = useState(emptyForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value, files } = e.target
    if (name === 'familyImg' && files) {
      setFamilyForm((prevForm) => ({
        ...prevForm,
        image: files[0] as any,
      }))
    } else {
      // Handle other inputs
      setFamilyForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }))
    }
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
        />

        {familyFrom.image === null ? (
          <>
            <label htmlFor="familyImg">Upload an image</label>
            <input
              type="file"
              className="familyImg"
              name="familyImg"
              id="familyImg"
              onChange={handleChange}
            />
          </>
        ) : (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              className="previewImage"
              src={URL.createObjectURL(familyFrom.image)}
              alt="Preview"
            />
            <button
              className="removeImageButton"
              style={{
                position: 'absolute',
                top: 10,
                right: -10,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'red',
              }}
              onClick={(e) => {
                e.preventDefault()
                setFamilyForm((prevForm) => ({
                  ...prevForm,
                  image: null,
                }))
              }}
            >
              ✖
            </button>
          </div>
        )}

        <button onClick={formSubmit}>Create your family</button>
      </form>
    </>
  )
}

export default CreateFamilyForm
