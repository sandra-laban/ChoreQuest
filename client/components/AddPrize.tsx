import { useAuth0 } from '@auth0/auth0-react'
import { addPrize } from '../apis/prizes'
import { PrizeData } from '../../models/prizes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'

export default function AddPrize() {
  interface Props {
    setFormView: (value: boolean) => void
  }
  // const { user } = useAuth0()
  // console.log(user)
  return <h1>PLACEHOLDER FOR ADD PRIZE FORM</h1>
}
