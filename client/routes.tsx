import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingPage from './components/LandingPage'
import ChoreList from './components/AllChores'
import Profile from './components/Profile'
import AllPrizes from './components/AllPrizes'
import Prize from './components/Prize'
import ManageFamily from './components/ManageFamily'
import Home from './components/Home'
import AuthCheck from './components/AuthCheck'
import EditProfileForm from './components/EditProfileForm'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingPage />} />
    <Route path="/chores" element={<AuthCheck element={<ChoreList />} />} />
    <Route path="/profile" element={<AuthCheck element={<Profile />} />} />
    <Route
      path="/profile/edit"
      element={<AuthCheck element={<EditProfileForm />} />}
    />
    <Route path="/prizes" element={<AuthCheck element={<AllPrizes />} />} />
    <Route
      path="/mngprizes/:prize"
      element={<AuthCheck element={<Prize />} />}
    />
    <Route
      path="/manage-family"
      element={<AuthCheck element={<ManageFamily />} />}
    />
    <Route path="/home" element={<AuthCheck element={<Profile />} />} />
  </Route>
)
