import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingPage from './components/LandingPage'
import ChoreList from './components/AllChores'
import Profile from './components/Profile'
import AllPrizes from './components/AllPrizes'
import AddPrize from './components/AddPrize'
import ManageFamily from './components/ManageFamily'
import Home from './components/Home'
import AuthCheck from './components/AuthCheck'
import NewUserForm from './components/NewUserForm'
import FamilyPage from './components/FamilyPage'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingPage />} />
    <Route path="/chores" element={<ChoreList />} />
    <Route path="/complete-profile" element={<NewUserForm />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/family" element={<FamilyPage />} />
    <Route path="/prizes" element={<AllPrizes />} />
    {/* <Route path="/prizes/add" element={<AddPrize />} /> */}
    <Route path="/manage-family" element={<ManageFamily />} />
    <Route path="/home" element={<Home />} />
    <Route path="/chores" element={<AuthCheck element={<ChoreList />} />} />
    <Route path="/profile" element={<AuthCheck element={<Profile />} />} />
    <Route path="/prizes" element={<AuthCheck element={<AllPrizes />} />} />
    <Route
      path="/manage-family"
      element={<AuthCheck element={<ManageFamily />} />}
    />
    <Route path="/home" element={<AuthCheck element={<Home />} />} />
  </Route>
)
