import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import data from '../data.json'
import '../styles/map.css'

// 修正 Leaflet 預設圖示路徑
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ============================================================
   路線顏色對應
   ============================================================ */
const ROUTE_COLORS = {
  'tmb': '#e67e22',
  'inca-trail': '#d4a017',
  'milford-track': '#3498db',
  'kumano-kodo': '#c0392b',
}

/* ============================================================
   地圖控制器：飛到選中路線的邊界
   ============================================================ */
function MapController({ flyToTarget }) {
  const map = useMap()

  useEffect(() => {
    if (!flyToTarget || !flyToTarget.routePath || flyToTarget.routePath.length === 0) {
      return
    }
    const bounds = L.latLngBounds(flyToTarget.routePath)
    map.flyToBounds(bounds, {
      padding: [100, 100],
      maxZoom: 10,
      duration: 1.2,
    })
  }, [flyToTarget, map])

  return null
}

/* ============================================================
   主元件
   ============================================================ */
export default function MapGuide() {
  const routesData = data.routes
  const defaultRoute = routesData.find((r) => r.id === 'tmb') || routesData[0]

  const [activeRouteId, setActiveRouteId] = useState(defaultRoute.id)
  const [flyToTarget, setFlyToTarget] = useState(defaultRoute)

  // 當前選中的路線（用來渲染右側卡片）
  const activeRoute =
    routesData.find((r) => r.id === activeRouteId) || defaultRoute

  // 切換路線：更新 state + 捲動到地圖區
  const handleSelectRoute = (route) => {
    setActiveRouteId(route.id)
    setFlyToTarget({ ...route }) // 展開新物件觸發 useEffect

    // 捲動到地圖區域（搭配 CSS 的 scroll-margin-top 避免被 navbar 遮住）
    requestAnimationFrame(() => {
      document
        .querySelector('.map-layout')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>探索全球頂級健行路線</h1>
        <p>點擊下方按鈕切換路線，或點擊地圖標記查看每日行程</p>
      </header>

      {/* ============ 上方：四個路線按鈕 ============ */}
      <div className="route-tabs">
        {routesData.map((route) => (
          <button
            key={route.id}
            className={`route-tab ${activeRouteId === route.id ? 'active' : ''}`}
            onClick={() => handleSelectRoute(route)}
          >
            <span
              className="tab-dot"
              style={{ background: ROUTE_COLORS[route.id] }}
            />
            {route.name}
          </button>
        ))}
      </div>

      {/* ============ 下方：左地圖 + 右卡片 ============ */}
      <div className="map-layout">
        {/* 左：地圖 */}
        <section className="map-section">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController flyToTarget={flyToTarget} />

            {routesData.map((route) => {
              const isActive = activeRouteId === route.id
              const color = ROUTE_COLORS[route.id] || '#2e7d32'

              return (
                <Fragment key={route.id}>
                  {/* 路線折線 */}
                  {route.routePath && (
                    <Polyline
                      positions={route.routePath}
                      pathOptions={{
                        color: isActive ? '#ff5722' : color,
                        weight: isActive ? 6 : 3,
                        opacity: isActive ? 1 : 0.35,
                        dashArray: isActive ? null : '10 6',
                      }}
                      eventHandlers={{
                        click: () => handleSelectRoute(route),
                      }}
                    />
                  )}

                  {/* 每天的行程點 */}
                  {route.itinerary.map((day) => {
                    const position =
                      day.coords || [route.location.lat, route.location.lng]
                    return (
                      <CircleMarker
                        key={`${route.id}-day-${day.day}`}
                        center={position}
                        radius={isActive ? 8 : 5}
                        pathOptions={{
                          color: '#fff',
                          weight: isActive ? 2 : 1,
                          fillColor: isActive ? '#ff5722' : color,
                          fillOpacity: isActive ? 1 : 0.5,
                        }}
                        eventHandlers={{
                          click: () => handleSelectRoute(route),
                        }}
                      >
                        <Popup>
                          <div className="map-popup">
                            {day.image && (
                              <img
                                src={day.image}
                                alt={day.title}
                                style={{
                                  width: '100%',
                                  height: '120px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  marginBottom: '8px',
                                }}
                              />
                            )}
                            <h4>
                              Day {day.day}：{day.title}
                            </h4>
                            <p className="popup-distance">
                              {day.distance} · {day.elevationGain}
                            </p>
                            <p className="popup-desc">{day.description}</p>
                            <Link
                              to={`/tour/${route.slug}`}
                              className="popup-link"
                            >
                              查看完整行程 →
                            </Link>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  })}
                </Fragment>
              )
            })}
          </MapContainer>
        </section>

        {/* 右：當前路線卡片（只有一張，隨 activeRouteId 切換） */}
        <aside className="map-right">
          <article className="current-card">
            <div className="current-card-image">
              <img src={activeRoute.heroImage} alt={activeRoute.name} />
              <span className="current-card-country">{activeRoute.country}</span>
              <span
                className={`current-card-difficulty difficulty-${activeRoute.difficulty.toLowerCase()}`}
              >
                {activeRoute.difficulty}
              </span>
            </div>

            <div className="current-card-content">
              <h2 className="current-card-title">{activeRoute.name}</h2>
              <p className="current-card-sub">{activeRoute.englishName}</p>

              <p className="current-card-summary">{activeRoute.summary}</p>

              {/* 數據指標 2x2 */}
              <div className="current-card-stats">
                <div className="stat-item">
                  <span className="stat-label">距離</span>
                  <span className="stat-value">{activeRoute.distanceKm} km</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">預估天數</span>
                  <span className="stat-value">{activeRoute.durationDays}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">最高海拔</span>
                  <span className="stat-value">{activeRoute.maxElevationM} m</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">難易度</span>
                  <span className="stat-value">{activeRoute.difficulty}</span>
                </div>
              </div>

              {/* 標籤 */}
              <div className="current-card-tags">
                {activeRoute.tags.map((tag) => (
                  <span key={tag} className="current-card-tag">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 按鈕 */}
              <Link
                to={`/tour/${activeRoute.slug}`}
                className="current-card-btn"
              >
                查看完整行程 →
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}