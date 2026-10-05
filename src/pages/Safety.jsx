import data from '../data'
import '../styles/safety.css'

export default function Safety() {
  const topics = data.safetyTopics

  return (
    <div className="safety-container">
      <header className="safety-header">
        <h1>登山安全指南</h1>
        <p>出發前必讀，讓每次登山都平安歸來</p>
      </header>

      <section className="safety-grid">
        {topics.map(topic => (
          <article key={topic.id} className="safety-card">
            <div className="safety-icon">{topic.id.toString().padStart(2, '0')}</div>
            <h2>{topic.title}</h2>
            <p>{topic.content}</p>
          </article>
        ))}
      </section>

      <section className="emergency-section">
        <h2>緊急聯絡</h2>
        <div className="emergency-grid">
          <div className="em-item">
            <span className="em-label">緊急救援</span>
            <span className="em-number">112</span>
          </div>
          <div className="em-item">
            <span className="em-label">消防</span>
            <span className="em-number">999</span>
          </div>
          <div className="em-item">
            <span className="em-label">警察</span>
            <span className="em-number">999</span>
          </div>
          <div className="em-item">
            <span className="em-label">國家搜救</span>
            <span className="em-number">HKSOS(App)或致電 999</span>
          </div>
        </div>
      </section>
    </div>
  )
}