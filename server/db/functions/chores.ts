import db from '../connection'

export function getAllChores() {
  return db('chores').select('*')
}
