export interface FamilyFormData {
  name: string
  password: string
  image?: File | null
  pictureUrl?: string
}

export interface Family {
  id: number
  name: string
  password: string
  picture: string
}
