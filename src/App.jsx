import { useState } from 'react'
import { generateNames } from './generator.js'

const MODES = ["any", "child", "modern", "formal", "ancient"]

const MODE_LABELS = {
  any:     { label: "Any",     desc: "A bit of everything" },
  child:   { label: "Childlike", desc: "Soft & bouncy" },
  modern:  { label: "Modern",  desc: "Balanced & easy" },
  formal:  { label: "Formal",  desc: "Dignified & proud" },
  ancient: { label: "Ancient", desc: "Old & rumbling" },
}

export default function App() {
  const [names, setNames] = useState([])
  const [mode, setMode] = useState("any")

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <span className="deco">🐸</span>
          <h1>Nakudama</h1>
          <p className="subtitle">Name Generator for the Frog-folk</p>
        </div>

        <div className="mode-selector">
          <div className="mode-row mode-row--any">
            <label className={`mode-pill ${mode === 'any' ? 'active' : ''}`}>
              <input type="radio" name="mode" value="any" checked={mode === 'any'} onChange={() => setMode('any')} />
              <span className="mode-label">{MODE_LABELS.any.label}</span>
              <span className="mode-desc">{MODE_LABELS.any.desc}</span>
            </label>
          </div>
          <div className="mode-row">
            {MODES.filter(m => m !== 'any').map(m => (
              <label key={m} className={`mode-pill ${mode === m ? 'active' : ''}`}>
                <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
                <span className="mode-label">{MODE_LABELS[m].label}</span>
                <span className="mode-desc">{MODE_LABELS[m].desc}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="generate-btn" onClick={() => setNames(generateNames(8, mode))}>
          ✨ Generate Names
        </button>

        {names.length > 0 && (
          <ul className="name-grid">
            {names.map((name, i) => (
              <li key={i} className="name-card">{name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

