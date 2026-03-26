import { useState } from 'react'
import { generateNames } from './generator.js'

const MODES = ["any", "child", "modern", "formal", "ancient"]

export default function App() {
  const [names, setNames] = useState([])
  const [mode, setMode] = useState("any")

  return (
    <>
      <h1>Nakudama Name Generator</h1>
      <div className="mode-selector">
        {MODES.map(m => (
          <label key={m}>
            <input
              type="radio"
              name="mode"
              value={m}
              checked={mode === m}
              onChange={() => setMode(m)}
            />
            {m}
          </label>
        ))}
      </div>
      <button onClick={() => setNames(generateNames(8, mode))}>
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
