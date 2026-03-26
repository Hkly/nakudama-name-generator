import { useState } from 'react'
import { Link } from 'react-router-dom'
import { generateNamesets } from './generator.js'

const CopyIcon = ({ size }) => (
  <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  </svg>
)

const NAME_TYPES = [
  { key: 'child',    label: 'Child Name' },
  { key: 'everyday', label: 'Everyday Name' },
  { key: 'formal',   label: 'Formal Name' },
  { key: 'ancient',  label: 'Ancient Name' },
]

function NamePill({ name, nameset, isExpanded, onToggle, copiedName, onCopy }) {
  if (isExpanded && nameset) {
    return (
      <li className="expanded-name-pill" onClick={onToggle}>
        <div className="expanded-names">
          {NAME_TYPES.map(({ key, label }) => (
            <div key={key} className="expanded-name-item">
              <div className="expanded-name-type">{label}</div>
              <div className="expanded-name-value" onClick={(e) => onCopy(e, nameset[key])}>
                {nameset[key]}
                <CopyIcon size={14} />
                {copiedName === nameset[key] && <span className="copy-tooltip">Name copied!</span>}
              </div>
            </div>
          ))}
        </div>
      </li>
    )
  }

  return (
    <li className="name-card" onClick={onToggle}>
      <div className="name-content">
        <div className="name-text" onClick={(e) => onCopy(e, name)}>
          {name}
          <CopyIcon size={16} />
          {copiedName === name && <span className="copy-tooltip">Name copied!</span>}
        </div>
      </div>
    </li>
  )
}

const MODES = ["any", "child", "modern", "formal", "ancient"]

const MODE_LABELS = {
  any:     { label: "Any",     desc: "A bit of everything" },
  child:   { label: "Childlike", desc: "Soft & bouncy" },
  modern:  { label: "Modern",  desc: "Balanced & easy" },
  formal:  { label: "Formal",  desc: "Dignified & proud" },
  ancient: { label: "Ancient", desc: "Old & rumbling" },
}

function getModeDisplayField(mode) {
  if (mode === "child") return "child";
  if (mode === "formal") return "formal";
  if (mode === "ancient") return "ancient";
  if (mode === "modern") return "everyday";
  // "any" mode: we'll need to pick one per nameset
  return null;
}

export default function App() {
  const [namesets, setNamesets] = useState([])
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

  const selectedNameset = selectedIdx !== null ? namesets[selectedIdx] : null

  const getDisplayName = (nameset) => {
    const displayField = getModeDisplayField(mode);
    if (displayField) {
      return nameset[displayField];
    }
    // "any" mode: use the pre-selected field stored in the nameset
    return nameset[nameset.anyModeField];
  }

  const renderColumn = (parity) =>
    namesets.map((nameset, i) => i % 2 === parity ? (
      <NamePill
        key={i}
        name={getDisplayName(nameset)}
        nameset={selectedIdx === i ? selectedNameset : null}
        isExpanded={selectedIdx === i}
        onToggle={() => handleNameClick(i)}
        copiedName={copiedName}
        onCopy={handleCopyName}
      />
    ) : null)

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

        <button className="generate-btn" onClick={() => { setNamesets(generateNamesets(8)); setSelectedIdx(null) }}>
          ✨ Generate Names ✨
        </button>

        {namesets.length > 0 && (
          <div className="name-grid-wrapper">
            <div className="name-column">{renderColumn(0)}</div>
            <div className="name-column">{renderColumn(1)}</div>
          </div>
        )}

        <div className="card-footer">
          <Link to="/about" className="about-link">About this name generator →</Link>
        </div>
      </div>
    </div>
  )
}
