import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <header className="header"></header>
      <section className="bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen">
        <Outlet />
      </section>
      <footer className="footer"></footer>
    </>
  )
}

export default App
