import { ChangeEvent, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addChore } from '../apis/chores'
import { ChoreData } from '../../models/chores'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useAuth0 } from '@auth0/auth0-react'
import { socketInstance } from '../apis/websocket'

const initalForm = {
  name: '',
  points: '',
  created: DateTime.local().toISODate(), // luxon
}

interface Props {
  setFormView: (value: boolean) => void
}

const AddChore = ({ setFormView }: Props) => {
  const { getAccessTokenSilently } = useAuth0()
  const accessTokenPromise = getAccessTokenSilently()
  const [form, setForm] = useState<ChoreData>(initalForm)
  const queryClient = useQueryClient()

  const addChoreMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await accessTokenPromise
      return await addChore(accessToken, form)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      socketInstance.emit('update_query_key', {
        queryKey: ['chores', 'notifications'],
        users: 'family',
        notificationMessage: `Chore ${form.name} added!`,
        pageUrl: '/chores',
      })
    },
  })

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target || { name: '', value: null }
    //console.log('name, value', name, value)
    let newValue: string | null = null

    // If the input is the 'created' date, value will be a Date object or null
    if (name === 'created') {
      if (value instanceof Date) {
        newValue = DateTime.fromJSDate(value).toISODate() || null
      } else if (typeof value === 'string') {
        newValue = value //Date.parse(value)
      } else if (value === null) {
        newValue = null
      }
    } else {
      newValue = value as string | null
    }

    const newForm = { ...form, [name]: newValue }
    setForm(newForm)
  }

  async function handleAddChange(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    await addChoreMutation.mutate()
    setForm(initalForm)
    setFormView(false)
  }

  return (
    <>
      <div>
        <form
          action=""
          onSubmit={handleAddChange}
          aria-label="Add Chore Form"
          className="flex flex-col items-center justify-center"
        >
          <div className="border p-8 border-gray-900/10 m-8">
            <h2 className="mx-auto mt-6 mb-6 text-center">Add new chore</h2>
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="name" className="text-2xl">
                What to do:
              </label>
              <input
                id="name"
                onChange={handleChange}
                name="name"
                value={form.name}
                className="border-solid border-2 border-black rounded-lg"
              ></input>
              <label htmlFor="points" className="text-2xl">
                Add few points:
              </label>
              <input
                id="points"
                onChange={handleChange}
                name="points"
                value={form.points}
                className="border-solid border-2 border-black rounded-lg"
              ></input>
              <label htmlFor="date" className="text-2xl">
                Pick a due date:
              </label>
              <DatePicker
                className="border-solid border-2 border-black rounded-lg"
                id="created"
                selected={DateTime.fromISO(form.created).toJSDate()} // Convert Luxon date to JavaScript Date
                onChange={(date) => {
                  if (date) {
                    const isoDate = DateTime.fromJSDate(date).toISODate()
                    console.log('Luxon Formatted Date:', isoDate)
                    handleChange({
                      target: { name: 'created', value: isoDate },
                    } as ChangeEvent<HTMLInputElement>)
                  }
                }}
                dateFormat="yyyy-MM-dd"
              />
              <div className="flex justify-center items-center">
                <button className="btn-primary mb-6 mt-6">Add Chore</button>
                <button
                  className="btn-primary mb-6 mt-6"
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

export default AddChore
