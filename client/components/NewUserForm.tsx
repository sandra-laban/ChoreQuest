import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { completeProfile } from '../apis/userApi'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import ImageGrid from './ImageGrid'
import { UserForm } from '../../models/Iforms'
import { Image } from '../../models/Iforms'

const initialForm = {
  username: '',
  picture: '',
}

function CompleteProfile() {
  const [form, setForm] = useState<UserForm>(initialForm)
  const { user } = useAuth0()
  const queryClient = useQueryClient()
  const completeProfileMutation = useMutation({
    mutationFn: () => completeProfile(user?.sub as string, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    completeProfileMutation.mutate()
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
      <h1 className="mx-auto mt-2 mb-6 text-center">COMPLETE YOUR PROFILE</h1>

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
          className="m-4 border-solid border-2 border-black p-2 px-5 w-1/3 rounded-lg mb-8"
        />

        <h2>Choose an Avatar</h2>
        <ImageGrid images={avatars} onSelect={handleImageSelect} />

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

export default CompleteProfile
