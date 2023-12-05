import { useState } from 'react'
import '../styles/CreateFamilyForm.css'
import { createFamily } from '../apis/family.ts'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const emptyForm = {
  name: '',
  password: '',
  image: null,
}

const CreateFamilyForm = () => {
  const [familyFrom, setFamilyForm] = useState(emptyForm)
  const { getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value, files } = e.target
    if (name === 'familyImg' && files) {
      setFamilyForm((prevForm) => ({
        ...prevForm,
        image: files[0] as any,
      }))
    } else {
      setFamilyForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }))
    }
  }

  const formSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createFamilyMutation.mutate()
  }

  const createFamilyMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await getAccessTokenSilently()
      await createFamily(familyFrom, accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigate('/')
    },
  })

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
