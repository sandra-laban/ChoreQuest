import AddTodo from './AddTodo.tsx'
import ChoreList from './AllChores.tsx'
import CreateFamilyForm from './CreateFamilyForm.tsx'

function App() {
  return (
    <>
      <header className="header">
  
        <CreateFamilyForm />
        <ChoreList />
      </header>
      <section className="main"></section>
      <footer className="footer"></footer>
    </>
  )
}

export default App
