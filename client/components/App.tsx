import AddTodo from './AddTodo.tsx'
import CreateFamilyForm from './CreateFamilyForm.tsx'

function App() {
  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <CreateFamilyForm />
      </header>
      <section className="main"></section>
      <footer className="footer"></footer>
    </>
  )
}

export default App
