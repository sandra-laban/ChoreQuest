import ChoreList from './AllChores.tsx'
import CreateFamilyForm from './CreateFamilyForm.tsx'
import JoinFamilyForm from './JoinFamilyForm.tsx'

function App() {
  return (
    <>
      <header className="header">
        <CreateFamilyForm />
        <JoinFamilyForm />
        <ChoreList />
      </header>
      <section className="main"></section>
      <footer className="footer"></footer>
    </>
  )
}

export default App
