import { useParams, Link, Navigate } from 'react-router-dom'
import data from '../data.json'
import '../styles/tour-detail.css'

export default function TourDetail() {
  const { slug } = useParams()
  const route = data.routes.find(item => item.slug === slug)

  if (!route) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="tour-detail">
      <div
        className="banner"
        style={{ backgroundImage: `url(${route.heroImage})` }}
      >
        <div className="banner-overlay">
          <span className="banner-country">{route.country}</span>
          <h1>{route.name}</h1>
          <p className="banner-sub">
            {route.englishName} · {route.durationDays}
          </p>
        </div>
      </div>

      <div className="tour-detail-inner">
        <section className="overview">
          <h2>路線概覽</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <span className="ov-label">總長度</span>
              <span className="ov-value">{route.distanceKm} km</span>
            </div>
            <div className="overview-item">
              <span className="ov-label">預估天數</span>
              <span className="ov-value">{route.durationDays}</span>
            </div>
            <div className="overview-item">
              <span className="ov-label">最高海拔</span>
              <span className="ov-value">{route.maxElevationM} m</span>
            </div>
            <div className="overview-item">
              <span className="ov-label">難易度</span>
              <span className="ov-value">{route.difficulty}</span>
            </div>
          </div>
          <p className="overview-summary">{route.summary}</p>
          <div className="tag-list">
            {route.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </section>

        <section className="itinerary">
          <h2>每日行程</h2>
          {route.itinerary.map(day => (
            <details key={day.day} className="accordion-item">
              <summary>
                <strong>Day {day.day}：</strong> {day.title}
                <span className="day-distance">（{day.distance}）</span>
              </summary>
              <div className="details-content">
                <p><strong>爬升高度：</strong> {day.elevationGain}</p>
                <p>{day.description}</p>
              </div>
            </details>
          ))}
        </section>

        <div className="detail-actions">
          <Link to="/map" className="back-btn">← 返回所有路線</Link>
          <Link to="/gear" className="gear-link-btn">查看裝備清單 →</Link>
        </div>
      </div>
    </div>
  )
}