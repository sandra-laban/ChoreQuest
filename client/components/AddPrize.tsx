import { useAuth0 } from '@auth0/auth0-react'
import { addPrize } from '../apis/prizes'
import { PrizeData } from '../../models/prizes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'

const initialForm = {
  name: '',
  definition: '',
  price: '',
  quantity: '',
}
interface Props {
  setFormView: (value: boolean) => void
}
export default function AddPrize({ setFormView }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [form, setForm] = useState<PrizeData>(initialForm)
  const queryClient = useQueryClient()

  const addPrizeMutation = useMutation({
    mutationFn: async () => {
      const token = await accessTokenPromise
      return await addPrize(form, token)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] })
    },
  })
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    const newForm = { ...form, [name]: value }
    setForm(newForm)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    addPrizeMutation.mutate(form)
  }

  return <h1>PLACEHOLDER FOR ADD PRIZE FORM</h1>
}
