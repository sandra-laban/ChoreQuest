import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { completeProfile, getAllUsers } from '../apis/userApi'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import ImageGrid from './ImageGrid'
import { UserForm } from '../../models/Iforms'
import { Image } from '../../models/Iforms'

const initialForm = {
  username: '',
  picture: '',
}

let currentForm: UserForm
function CompleteProfile() {
  const [form, setForm] = useState<UserForm>(initialForm)
  const [submit, setSubmit] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth0()
  const queryClient = useQueryClient()
  console.log(user)
  const completeProfileMutation = useMutation({
    mutationFn: () => completeProfile(user?.sub as string, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const {
    data: allUsers,
    isError,
    isLoading,
  } = useQuery({ queryKey: ['users'], queryFn: () => getAllUsers() })
  if (isError) {
    return <div>There was an error getting all users...</div>
  }

  if (!allUsers || isLoading) {
    return <div>Loading all profiles...</div>
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target
    const newForm = { ...form, [name]: value }
    setForm(newForm)
  }

  function handleImageSelect(selectedImage: Image) {
    setForm((prevForm) => ({
      ...prevForm,
      picture: selectedImage.url,
    }))
    console.log(form)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    currentForm = { ...form }
    completeProfileMutation.mutate()
    setSubmit(true)
  }

  function handleRedirect(event: any) {
    navigate('/')
  }

  const avatars = [
    { id: 1, url: '/image/avatars/avatar1.png', alt: 'Avatar 1' },
    { id: 2, url: '/image/avatars/avatar2.png', alt: 'Avatar 2' },
    { id: 3, url: '/image/avatars/avatar3.png', alt: 'Avatar 3' },
    { id: 4, url: '/image/avatars/avatar4.png', alt: 'Avatar 4' },
    { id: 5, url: '/image/avatars/avatar5.png', alt: 'Avatar 5' },
    { id: 6, url: '/image/avatars/avatar6.png', alt: 'Avatar 6' },
    { id: 7, url: '/image/avatars/avatar7.png', alt: 'Avatar 7' },
    { id: 8, url: '/image/avatars/avatar8.png', alt: 'Avatar 8' },
    { id: 9, url: '/image/avatars/avatar9.png', alt: 'Avatar 9' },
    { id: 10, url: '/image/avatars/avatar10.png', alt: 'Avatar 10' },
    { id: 11, url: '/image/avatars/avatar11.png', alt: 'Avatar 11' },
    { id: 12, url: '/image/avatars/avatar12.png', alt: 'Avatar 12' },
    { id: 13, url: '/image/avatars/avatar13.png', alt: 'Avatar 13' },
    { id: 14, url: '/image/avatars/avatar14.png', alt: 'Avatar 14' },
    { id: 15, url: '/image/avatars/avatar15.png', alt: 'Avatar 15' },
    { id: 16, url: '/image/avatars/avatar16.png', alt: 'Avatar 16' },
  ]

  return (
    <>
      <h1 className="mx-auto mt-12">COMPLETE YOUR PROFILE</h1>
      {!allUsers.some((user) => user.name === currentForm?.username) ? (
        <form onSubmit={handleSubmit} className="form-layout">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="form-input"
          />
          {allUsers.some((user) => user.name === form.username) ? (
            <p className="form-warning">Username already exists</p>
          ) : null}

          <h2>Choose an Avatar</h2>
          <ImageGrid images={avatars} onSelect={handleImageSelect} />

          {!allUsers.some((user) => user.name === form.username) ? (
            <button type="submit" className="login-button">
              Submit
            </button>
          ) : null}
        </form>
      ) : null}
      {submit && allUsers.some((user) => user.name === currentForm.username) ? (
        <div className="signup-success">
          <h2 className="text-center">
            Thank you for completing your profile!
          </h2>

          <button className="login-button" onClick={handleRedirect}>
            Home
          </button>
        </div>
      ) : null}
    </>
  )
}

export default CompleteProfile
