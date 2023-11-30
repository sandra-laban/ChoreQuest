import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App'
import ChoreList from './components/AllChores'

export const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<App />}></Route>
    <Route path="/chores">
      <Route index element={<ChoreList />} />
    </Route>
  </>
)
