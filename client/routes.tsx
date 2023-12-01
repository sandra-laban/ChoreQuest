import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingPage from './components/LandingPage'
import ChoreList from './components/AllChores'
import NewUserForm from './components/NewUserForm'
import Profile from './components/Profile'
import EditProfileForm from './components/EditProfileForm'
import CreateFamilyForm from './components/CreateFamilyForm'
import JoinFamilyForm from './components/JoinFamilyForm'
import HomePage from './components/HomePage'
import AllPrizes from './components/AllPrizes'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingPage />} />
    <Route path="/chores" element={<ChoreList />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/complete-profile" element={<NewUserForm />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route path="/profile/:id/edit" element={<EditProfileForm />} />
    <Route path="/family/create" element={<CreateFamilyForm />} />
    <Route path="/family/join" element={<JoinFamilyForm />} />
    <Route path="/prizes" element={<AllPrizes />} />
  </Route>
)
