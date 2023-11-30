import { ChangeEvent, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addChore } from '../apis/chores'
import { ChoreData } from '../../models/chores'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'

const initalForm = {
  name: '',
  points: '',
  created: DateTime.local().toISODate(), // luxon
}

const AddChore = () => {
  const [form, setForm] = useState<ChoreData>(initalForm)
  const queryClient = useQueryClient()

  const addChoreMutation = useMutation({
    mutationFn: addChore,
    onSuccess: () => {
      try {
        queryClient.invalidateQueries(['chores'])
      } catch (err) {
        console.log(err)
      }
    },
  })
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | Date | null>
  ) {
    const { name, value } = e.target || { name: '', value: null }

    let newValue: string | null = null

    // If the input is the 'created' date, value will be a Date object or null
    if (name === 'created') {
      if (value instanceof Date) {
        newValue = DateTime.fromJSDate(value).toISODate() || null
      } else if (value === null) {
        newValue = null
      }
    } else {
      newValue = value as string | null
    }

    const newForm = { ...form, [name]: newValue }
    setForm(newForm)
  }

  function handleAddChange(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    addChoreMutation.mutate(form)
    setForm(initalForm)
  }

  return (
    <>
      <div>
        <form action="" onSubmit={handleAddChange} aria-label="Add Chore Form">
          <div className="border p-8 border-gray-900/10 m-8">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add new chore
            </h2>
            <div className="space-y-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name:
                  </label>
                  <input
                    id="name"
                    onChange={handleChange}
                    name="name"
                    value={form.name}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  ></input>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="points"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Points:
                </label>
                <input
                  id="points"
                  onChange={handleChange}
                  name="points"
                  value={form.points}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                ></input>
              </div>
              <div className="form-group">
                <DatePicker
                  id="created"
                  selected={DateTime.fromISO(form.created).toJSDate()} // Convert Luxon date to JavaScript Date
                  onChange={(date) => {
                    const isoDate = DateTime.fromJSDate(date).toISODate()
                    handleChange({
                      target: { name: 'created', value: isoDate },
                    } as ChangeEvent<HTMLInputElement>)
                  }}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Add Chore
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddChore
