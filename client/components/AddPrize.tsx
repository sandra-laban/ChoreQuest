import { useAuth0 } from '@auth0/auth0-react'
import { addPrize } from '../apis/prizes'
import { PrizeData } from '../../models/prizes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'

const initialForm: PrizeData = {
  name: '',
  definition: '',
  price: 0,
  quantity: 0,
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
    mutationFn: async (form: PrizeData) => {
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(form)
    // const newForm = {...form,}
    addPrizeMutation.mutate(form)
    setForm(initialForm)
    setFormView(false)
  }

  if (addPrizeMutation.isPending) {
    return <p>Adding your prize...</p>
  }

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          aria-label="Add prize form"
          className="flex flex-col items-center justify-center"
        >
          <div className="border p-8 border-gray-900/10 m-8">
            <h2 className="text-center text-purple-950 mt-4 mb-8 text-3xl">
              Add a new prize!
            </h2>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="name" className="text-2xl">
                Name:
              </label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                name="name"
                value={form.name}
              />
              <label htmlFor="definition" className="text-2xl  text-purple-950">
                Definition:
              </label>
              <input
                type="text"
                id="definition"
                onChange={handleChange}
                name="definition"
                value={form.definition}
              />
              <label htmlFor="price" className="text-2xl  text-purple-950">
                Price:
              </label>
              <input
                type="text"
                id="price"
                onChange={handleChange}
                name="price"
                value={form.price}
              />
              <label htmlFor="quantity" className="text-2xl  text-purple-950">
                Quantity:
              </label>
              <input
                type="text"
                id="quantity"
                onChange={handleChange}
                name="quantity"
                value={form.quantity}
              />
              <div className="flex justify-center items-center">
                <button className="btn-primary mb-12">Add Prize!</button>
                <button
                  className="btn-primary mb-12"
                  onClick={() => setFormView(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
