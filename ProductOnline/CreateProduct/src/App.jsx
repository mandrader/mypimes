import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Catalogo from './components/Catalogo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Catalogo De Productos</h1>
        <Catalogo />
      </div>
    </>
  )
}

export default App
