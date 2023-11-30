import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllUsers, updateProfile } from '../apis/userApi'
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
function EditProfileForm() {
  const [form, setForm] = useState<UserForm>(initialForm)
  const [submit, setSubmit] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth0()
  const queryClient = useQueryClient()
  console.log(user)
  const updateProfileMutation = useMutation({
    mutationFn: () => updateProfile(user?.sub as string, form),
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
    updateProfileMutation.mutate()
    setSubmit(true)
  }

  function handleRedirect(event: any) {
    navigate('/')
  }

  const avatars = [
    { id: 1, url: '/images/avatars/avatar-1.png', alt: 'Avatar 1' },
    { id: 2, url: '/images/avatars/avatar-2.png', alt: 'Avatar 2' },
    { id: 3, url: '/images/avatars/avatar-3.png', alt: 'Avatar 3' },
    { id: 4, url: '/images/avatars/avatar-4.png', alt: 'Avatar 4' },
    { id: 5, url: '/images/avatars/avatar-5.png', alt: 'Avatar 5' },
    { id: 6, url: '/images/avatars/avatar-6.png', alt: 'Avatar 6' },
    { id: 7, url: '/images/avatars/avatar-7.png', alt: 'Avatar 7' },
    { id: 8, url: '/images/avatars/avatar-8.png', alt: 'Avatar 8' },
    { id: 9, url: '/images/avatars/avatar-9.png', alt: 'Avatar 9' },
    { id: 10, url: '/images/avatars/avatar-10.png', alt: 'Avatar 10' },
    { id: 11, url: '/images/avatars/avatar-11.png', alt: 'Avatar 11' },
    { id: 12, url: '/images/avatars/avatar-12.png', alt: 'Avatar 12' },
    { id: 13, url: '/images/avatars/avatar-13.png', alt: 'Avatar 13' },
    { id: 14, url: '/images/avatars/avatar-14.png', alt: 'Avatar 14' },
    { id: 15, url: '/images/avatars/avatar-15.png', alt: 'Avatar 15' },
    { id: 16, url: '/images/avatars/avatar-16.png', alt: 'Avatar 16' },
  ]

  return (
    <div>
      <img
        src="/images/chorequest.png"
        alt="ChoreQuest Logo"
        className="mx-auto w-1/3"
      />
      <h1 className="mx-auto mt-12 mb-6 text-center">EDIT YOUR PROFILE</h1>
      {!allUsers.some((user) => user.name === currentForm?.username) ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <label htmlFor="username" className="text-2xl">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="m-4 border-solid border-2 border-black p-2 px-5 w-1/3 rounded-lg mb-12"
          />
          {allUsers.some(
            (profile) =>
              profile.auth_id !== user?.sub && profile.name === form.username
          ) ? (
            <p className="bg-red-100 border-rose-600 border-4 rounded-lg py-2 px-4 mb-4">
              Username already exists
            </p>
          ) : null}

          <h2>Choose an Avatar</h2>
          <ImageGrid images={avatars} onSelect={handleImageSelect} />

          {!allUsers.some(
            (profile) =>
              profile.auth_id !== user?.sub && profile.name === form.username
          ) ? (
            <button
              type="submit"
              className="btn-primary mb-12 items-center justify-center"
            >
              Submit
            </button>
          ) : null}
        </form>
      ) : null}
      {submit &&
      allUsers.some((profile) => profile.name === currentForm.username) ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center m-10">
            Thank you for updating your profile!
          </h2>

          <button className="btn-primary m-12" onClick={handleRedirect}>
            Home
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default EditProfileForm
