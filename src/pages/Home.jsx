import { useState } from 'react'
import { Link } from 'react-router-dom'
import data from '../data.json'
import '../styles/home.css'

export default function Home() {
  const routes = data.routes

  const topRoute = routes.find(r => r.id === 'tmb') || routes[0]
  const rightRoute = routes.find(r => r.id === 'milford-track') || routes[1]
  const bottomRoute = routes.find(r => r.id === 'kumano-kodo') || routes[2]
  const leftRoute = routes.find(r => r.id === 'inca-trail') || routes[3]

  const crossRoutes = [
    { ...topRoute, position: 'top' },
    { ...rightRoute, position: 'right' },
    { ...bottomRoute, position: 'bottom' },
    { ...leftRoute, position: 'left' },
  ]

  const featuredRoute = topRoute
  const [preferredDays, setPreferredDays] = useState('all')

  const filteredPreview = routes.filter(r => {
    if (preferredDays === 'short') return r.distanceKm <= 50
    if (preferredDays === 'long') return r.distanceKm > 50
    return true
  })

  return (
    <div className="home-container">
      {/* X 型 Hero */}
      <section className="hero-x-container">
        {crossRoutes.map(route => (
          <Link
            key={route.id}
            to={`/tour/${route.slug}`}
            className={`x-slice slice-${route.position}`}
          >
            <div
              className="slice-bg"
              style={{ backgroundImage: `url(${route.heroImage})` }}
            />
            <div className="slice-overlay" />
            <div className={`slice-content content-${route.position}`}>
              <span className="slice-country">{route.country}</span>
              <h2 className="slice-title">{route.name}</h2>
              <p className="slice-desc">
                {route.distanceKm} km · {route.durationDays}
              </p>
              <span className="slice-btn">探索路線 →</span>
            </div>
          </Link>
        ))}

        <div className="x-center-badge">
          <img src="/Travel_LOGO_0916.png" alt="Logo" className="badge-logo" />
          <span>PeakExplore</span>
        </div>
      </section>

      {/* 主打推薦 */}
      <section className="featured-banner">
        <div className="featured-content">
          <span className="section-subtitle">主打推薦路線</span>
          <h2>{featuredRoute.name}</h2>
          <p className="featured-desc">{featuredRoute.summary}</p>
          <div className="featured-tags">
            {featuredRoute.tags.map(tag => (
              <span key={tag} className="tag-chip">#{tag}</span>
            ))}
          </div>
          <Link to={`/tour/${featuredRoute.slug}`} className="read-more-btn">
            深入探索{featuredRoute.name}詳情 →
          </Link>
        </div>
        <div className="featured-image-wrapper">
          <img src={featuredRoute.heroImage} alt={featuredRoute.name} />
        </div>
      </section>

      {/* 快速篩選 */}
      <section className="quiz-section">
        <h2>找不到想去的步道？快速篩選推薦</h2>
        <div className="quiz-buttons">
          <button
            className={`quiz-btn ${preferredDays === 'all' ? 'active' : ''}`}
            onClick={() => setPreferredDays('all')}
          >
            全部 4 大路線
          </button>
          <button
            className={`quiz-btn ${preferredDays === 'short' ? 'active' : ''}`}
            onClick={() => setPreferredDays('short')}
          >
            短程/精華健行 (≤ 50km)
          </button>
          <button
            className={`quiz-btn ${preferredDays === 'long' ? 'active' : ''}`}
            onClick={() => setPreferredDays('long')}
          >
            長程縱走大縱貫 (&gt; 50km)
          </button>
        </div>

        <div className="preview-grid">
          {filteredPreview.map(route => (
            <div key={route.id} className="preview-card">
              <img src={route.heroImage} alt={route.name} />
              <div className="card-info">
                <span className="country-tag">{route.country}</span>
                <h3>{route.name}</h3>
                <p>{route.distanceKm} km · {route.durationDays}</p>
                <Link to={`/tour/${route.slug}`} className="card-link">
                  查看詳情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}