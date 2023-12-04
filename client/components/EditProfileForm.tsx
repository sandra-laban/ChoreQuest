import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import ImageGrid from './ImageGrid'
import { UserForm } from '../../models/Iforms'
import { Image } from '../../models/Iforms'
import { getUser, updateProfile } from '../apis/userApi'

let currentForm: UserForm
function EditProfileForm() {
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const accessTokenPromise = getAccessTokenSilently()
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await accessTokenPromise
      updateProfile(accessToken, form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigate('/profile')
    },
  })

  const { data, error, isPending } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const accessToken = await accessTokenPromise
      return await getUser(accessToken)
    },
  })

  const profile = data?.profile

  const initialForm = {
    username: profile?.name,
    picture: profile?.picture,
  }
  const [form, setForm] = useState<UserForm>(initialForm as UserForm)

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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    currentForm = { ...form }
    console.log('component', form)
    await updateProfileMutation.mutate()
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

  const currentAvatar = avatars.find(
    (avatar) => avatar.url === profile?.picture
  )

  return (
    <div>
      <h1 className="mx-auto mt-12 mb-6 text-center">EDIT YOUR PROFILE</h1>

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
          placeholder={`${profile?.name}`}
          name="username"
          onChange={handleChange}
          className="m-4 border-solid border-2 border-black p-2 px-5 w-1/3 rounded-lg mb-12"
        />

        <h2>Choose an Avatar</h2>
        <ImageGrid
          images={avatars}
          onSelect={handleImageSelect}
          current={currentAvatar}
        />

        <button
          type="submit"
          className="btn-primary mb-12 items-center justify-center"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default EditProfileForm
