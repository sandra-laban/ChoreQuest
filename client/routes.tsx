import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingPage from './components/LandingPage'
import ChoreList from './components/AllChores'
import NewUserForm from './components/NewUserForm'
import Profile from './components/Profile'
import FamilyPage from './components/FamilyPage'
import AllPrizes from './components/AllPrizes'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingPage />} />
    <Route path="/chores" element={<ChoreList />} />
    <Route path="/complete-profile" element={<NewUserForm />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/family" element={<FamilyPage />} />
    <Route path="/prizes" element={<AllPrizes />} />
  </Route>
)
