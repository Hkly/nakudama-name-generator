import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import aboutContent from '../about.md?raw'

export default function About() {
  return (
    <div className="page">
      <div className="card">
        <Link to="/" className="back-link">← Back to Generator</Link>
        <div className="about-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutContent}</ReactMarkdown>
        </div>
        <Link to="/" className="back-link">← Back to Generator</Link>
      </div>
    </div>
  )
}
