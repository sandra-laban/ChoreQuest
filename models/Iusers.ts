export interface User {
  id?: number
  auth_id: string
  name: string
  picture: string
  points?: number
  is_parent?: boolean
  family_id?: number
}

export interface CompleteUser extends User {
  familyName?: string
}
