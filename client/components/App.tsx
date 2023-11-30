import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <header className="header">
        <h1>App</h1>
      </header>
      <section className="main">
        <Outlet />
      </section>
      <footer className="footer"></footer>
    </>
  )
}

export default App
