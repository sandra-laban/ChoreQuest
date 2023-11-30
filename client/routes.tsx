import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingTemp from './components/LandingTemp'
import ChoreList from './components/AllChores'
import CreateFamilyForm from './components/CreateFamilyForm'
import JoinFamilyForm from './components/JoinFamilyForm'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingTemp />} />
    <Route path="/chores" element={<ChoreList />} />
    <Route path="/family/create" element={<CreateFamilyForm />} />
    <Route path="/family/join" element={<JoinFamilyForm />} />
  </Route>
)
