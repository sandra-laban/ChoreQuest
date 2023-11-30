import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingPage from './components/LandingPage'
import ChoreList from './components/AllChores'
import NewUserForm from './components/NewUserForm'
import Profile from './components/Profile'
import EditProfileForm from './components/EditProfileForm'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingPage />} />
    <Route path="/chores" element={<ChoreList />} />
    <Route path="/complete-profile" element={<NewUserForm />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route path="/profile/:id/edit" element={<EditProfileForm />} />
  </Route>
)
