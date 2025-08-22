import { useState } from 'react'
import MovieObservationsPage from './pages/MovieObservationsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <MovieObservationsPage/>
    </>
  )
}

export default App
