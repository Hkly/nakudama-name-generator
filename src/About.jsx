import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <span className="deco">🐸</span>
          <h1>About</h1>
          <p className="subtitle">The Nakudama & their world</p>
        </div>

        <div className="about-body">
          <h2>Who are the Nakudama?</h2>
          <p>
            Placeholder text — describe the Nakudama frog-folk here. Where do they live?
            What is their culture like? What do they value?
          </p>

          <h2>Naming Traditions</h2>
          <p>
            Placeholder text — explain how names work in Nakudama culture. Are names given
            at birth, earned, or chosen? What do the different styles (ancient, formal, etc.) signify?
          </p>

          <h2>Modes</h2>
          <p>
            Placeholder text — describe what each generation mode represents in-world.
            Maybe "ancient" names belong to elders, "childlike" to young tadpoles, and so on.
          </p>
        </div>

        <Link to="/" className="back-link">← Back to Generator</Link>
      </div>
    </div>
  )
}
