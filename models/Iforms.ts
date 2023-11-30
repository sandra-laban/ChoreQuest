export interface Image {
  id: number
  url: string
  alt: string
}

export interface UserForm {
  username: string
  picture: string
}

export interface UpdateUserForm extends UserForm {
  auth_id: string
}
