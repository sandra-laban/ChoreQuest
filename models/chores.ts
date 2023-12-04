import { DateTime } from 'luxon'

export interface Chore {
  id: number
  name: string
  points: number
  created: string
  family_id: number
  is_completed: boolean
}
export interface ChoreData {
  name: string
  points: string
  created: string
}

export interface AssignedChore {
  chores_id: number
  users_id: number
  assigned: string
  due: string | null
  is_completed: boolean
}
