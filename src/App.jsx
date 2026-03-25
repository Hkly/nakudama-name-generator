import { useState } from 'react'
import { generateNames } from './generator.js'

export default function App() {
  const [names, setNames] = useState([])

  return (
    <>
      <h1>Nakudama Name Generator</h1>
      <button onClick={() => setNames(generateNames())}>
        Generate Names
      </button>
      {names.length > 0 && (
        <ul className="name-grid">
          {names.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      )}
    </>
  )
}
