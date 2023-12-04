import { DateTime } from 'luxon'

export interface Chore {
  id: number
  name: string
  points: number
  created: string
  family_id: number
}
export interface ChoreData {
  name: string
  points: string
  created: string
}
