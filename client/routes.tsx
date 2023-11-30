import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './components/App'
import LandingTemp from './components/LandingTemp'

export const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LandingTemp />} />
  </Route>
)
