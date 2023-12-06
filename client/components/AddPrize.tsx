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
      <div className="family-form mt-8 w-1/2 mx-auto">
        <form
          onSubmit={handleSubmit}
          aria-label="Add prize form"
          className="flex flex-col items-center justify-center"
        >
          <div className="border p-8 border-gray-900/10 m-8">
            <h2 className="main-title d-text">Add a new prize!</h2>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="name" className="text-2xl text-white">
                Name:
              </label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                name="name"
                value={form.name}
                className="border-solid border-2 border-black rounded-lg mb-6"
              />
              <label htmlFor="definition" className="text-2xl  text-white">
                Definition:
              </label>
              <input
                type="text"
                id="definition"
                onChange={handleChange}
                name="definition"
                value={form.definition}
                className="border-solid border-2 border-black rounded-lg mb-6"
              />
              <label htmlFor="price" className="text-2xl  text-white">
                Price:
              </label>
              <input
                type="text"
                id="price"
                onChange={handleChange}
                name="price"
                value={form.price}
                className="border-solid border-2 border-black rounded-lg mb-6"
              />
              <label htmlFor="quantity" className="text-2xl  text-white">
                Quantity:
              </label>
              <input
                type="text"
                id="quantity"
                onChange={handleChange}
                name="quantity"
                value={form.quantity}
                className="border-solid border-2 border-black rounded-lg mb-6"
              />
              <div className="flex justify-center items-center">
                <button className="btn-primary mx-4 ">Add Prize!</button>
                <button
                  className="btn-primary"
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
