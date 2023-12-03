import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const { user } = useAuth0()
  return (
    <>
      {user && (
        <header className="header">
          <Nav />
        </header>
      )}

      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen pt-48">
        <Outlet />
      </section>
      <footer className="footer"></footer>
    </>
  )
}

export default App
