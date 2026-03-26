import { useState } from 'react'
import { Link } from 'react-router-dom'
import { generateNames } from './generator.js'

const MODES = ["any", "child", "modern", "formal", "ancient"]

const MODE_LABELS = {
  any:     { label: "Any",     desc: "A bit of everything" },
  child:   { label: "Childlike", desc: "Soft & bouncy" },
  modern:  { label: "Modern",  desc: "Balanced & easy" },
  formal:  { label: "Formal",  desc: "Dignified & proud" },
  ancient: { label: "Ancient", desc: "Old & rumbling" },
}

// Placeholder nameset for demonstration
const PLACEHOLDER_NAMESETS = {
  0: { child: "KoroKoro", everyday: "Korobu", formal: "Koronaku", ancient: "Krokrobrano" },
  1: { child: "MakoMako", everyday: "Makoru", formal: "Makoranaku", ancient: "Makograbu" },
  2: { child: "RabuRabu", everyday: "Rabugro", formal: "Rabunaku", ancient: "Rabakronu" },
  3: { child: "BruBru", everyday: "Brumo", formal: "Brunaku", ancient: "Brugrakro" },
  4: { child: "GuruGuru", everyday: "Guramu", formal: "Guranaku", ancient: "Gradubranu" },
  5: { child: "NaruNaru", everyday: "Narubra", formal: "Narunaku", ancient: "Nargrabromu" },
  6: { child: "SoruSoru", everyday: "Soruga", formal: "Sorunaku", ancient: "Sorugakron" },
  7: { child: "ToroToro", everyday: "Torogru", formal: "Toronaku", ancient: "Torokrabrun" },
}

export default function App() {
  const [names, setNames] = useState([])
  const [mode, setMode] = useState("any")
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [copiedName, setCopiedName] = useState(null)

  const handleNameClick = (idx) => {
    setSelectedIdx(selectedIdx === idx ? null : idx)
  }

  const handleCopyName = (e, name) => {
    e.stopPropagation()
    navigator.clipboard.writeText(name)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 1500)
  }

  const selectedNameset = selectedIdx !== null ? PLACEHOLDER_NAMESETS[selectedIdx] : null

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <span className="deco">🐸</span>
          <h1>Nakudama</h1>
          <p className="subtitle">
            Built from soft syllables and croaky consonant clusters, Nakudama names are meant to sound a bit like frogs calling across the marsh.
          </p>
          <p className="pt-1">
            <Link to="/about" className="about-link">Read more about the Naku Naku names →</Link>
          </p>
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

        <button className="generate-btn" onClick={() => { setNames(generateNames(8, mode)); setSelectedIdx(null) }}>
          ✨ Generate Names ✨
        </button>

        {names.length > 0 && (
          <div className="name-grid-wrapper">
            <div className="name-column">
              {names.map((name, i) => (i % 2 === 0 ? (
                selectedIdx === i ? (
                  <li key={i} className="expanded-name-pill" onClick={() => handleNameClick(i)}>
                    <div className="expanded-names">
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Child Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.child)}>
                          {selectedNameset.child}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.child && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Everyday Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.everyday)}>
                          {selectedNameset.everyday}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.everyday && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Formal Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.formal)}>
                          {selectedNameset.formal}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.formal && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Ancient Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.ancient)}>
                          {selectedNameset.ancient}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.ancient && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={i} className="name-card" onClick={() => handleNameClick(i)}>
                    <div className="name-content">
                      <div className="name-text" onClick={(e) => handleCopyName(e, name)}>
                        {name}
                        <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                        {copiedName === name && <span className="copy-tooltip">Name copied!</span>}
                      </div>
                    </div>
                  </li>
                )
              ) : null))}
            </div>
            <div className="name-column">
              {names.map((name, i) => (i % 2 === 1 ? (
                selectedIdx === i ? (
                  <li key={i} className="expanded-name-pill" onClick={() => handleNameClick(i)}>
                    <div className="expanded-names">
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Child Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.child)}>
                          {selectedNameset.child}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.child && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Everyday Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.everyday)}>
                          {selectedNameset.everyday}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.everyday && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Formal Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.formal)}>
                          {selectedNameset.formal}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.formal && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                      <div className="expanded-name-item">
                        <div className="expanded-name-type">Ancient Name</div>
                        <div className="expanded-name-value" onClick={(e) => handleCopyName(e, selectedNameset.ancient)}>
                          {selectedNameset.ancient}
                          <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                          {copiedName === selectedNameset.ancient && <span className="copy-tooltip">Name copied!</span>}
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={i} className="name-card" onClick={() => handleNameClick(i)}>
                    <div className="name-content">
                      <div className="name-text" onClick={(e) => handleCopyName(e, name)}>
                        {name}
                        <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                        {copiedName === name && <span className="copy-tooltip">Name copied!</span>}
                      </div>
                    </div>
                  </li>
                )
              ) : null))}
            </div>
          </div>
        )}

        <div className="card-footer">
          <Link to="/about" className="about-link">About this name generator →</Link>
        </div>
      </div>
    </div>
  )
}
