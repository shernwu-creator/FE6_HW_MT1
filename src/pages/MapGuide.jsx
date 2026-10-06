import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import data from '../data'
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
   點擊地圖空白處：關閉每日行程卡
   ============================================================ */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  })

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
  // 目前點開的每日行程（null 表示未開啟）：以浮動卡片呈現，不使用 Leaflet popup
  const [activeDay, setActiveDay] = useState(null)

  // 當前選中的路線（用來渲染右側卡片）
  const activeRoute =
    routesData.find((r) => r.id === activeRouteId) || defaultRoute

  // 是否為目前點開的行程點（用來加大／變色標記）
  const isDaySelected = (route, day) =>
    activeDay?.route.id === route.id && activeDay?.day.day === day.day

  // 切換路線：更新 state + 捲動到地圖區
  // scroll 為 false 時（例如直接點地圖上的路線）只切換路線，不捲動頁面
  const handleSelectRoute = (route, { scroll = true } = {}) => {
    setActiveRouteId(route.id)
    setFlyToTarget({ ...route }) // 展開新物件觸發 useEffect
    setActiveDay(null)

    // 捲動到地圖區域（搭配 CSS 的 scroll-margin-top 避免被 navbar 遮住）
    if (scroll) {
      requestAnimationFrame(() => {
        document
          .querySelector('.map-layout')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  // 點擊行程標記：只切換路線高亮並開啟行程卡。
  // 不呼叫 flyToBounds、也不捲動頁面，避免畫面卡頓與路線被自動平移擠壓。
  const handleSelectDay = (route, day) => {
    setActiveRouteId(route.id)
    setActiveDay((prev) =>
      prev && prev.route.id === route.id && prev.day.day === day.day
        ? null
        : { route, day }
    )
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

            {/* 點擊地圖空白處關閉行程卡 */}
            <MapClickHandler onMapClick={() => setActiveDay(null)} />

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
                        click: () =>
                          handleSelectRoute(route, { scroll: false }),
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
                        radius={isDaySelected(route, day) ? 10 : isActive ? 8 : 5}
                        bubblingMouseEvents={false}
                        pathOptions={{
                          color: '#fff',
                          weight: isDaySelected(route, day) ? 3 : isActive ? 2 : 1,
                          fillColor: isDaySelected(route, day)
                            ? '#ffb300'
                            : isActive
                              ? '#ff5722'
                              : color,
                          fillOpacity: isDaySelected(route, day)
                            ? 1
                            : isActive
                              ? 1
                              : 0.5,
                        }}
                        eventHandlers={{
                          click: () => handleSelectDay(route, day),
                        }}
                      />
                    )
                  })}
                </Fragment>
              )
            })}
          </MapContainer>

          {/* 每日行程卡：固定貼齊地圖左下角，內容完整顯示且不會平移／擠壓地圖 */}
          {activeDay && (
            <div
              className="map-day-card"
              role="dialog"
              aria-label={`Day ${activeDay.day.day} ${activeDay.day.title}`}
            >
              <button
                type="button"
                className="map-day-close"
                onClick={() => setActiveDay(null)}
                aria-label="關閉"
              >
                ×
              </button>

              <div className="map-day-card-body">
                <div className="map-popup">
                  <span
                    className="map-day-route"
                    style={{
                      color:
                        ROUTE_COLORS[activeDay.route.id] || 'var(--accent)',
                    }}
                  >
                    {activeDay.route.name}
                  </span>

                  {activeDay.day.image && (
                    <img
                      className="map-day-image"
                      src={activeDay.day.image}
                      alt={activeDay.day.title}
                    />
                  )}

                  <h4>
                    Day {activeDay.day.day}：{activeDay.day.title}
                  </h4>
                  <p className="popup-distance">
                    {activeDay.day.distance} · {activeDay.day.elevationGain}
                  </p>
                  <p className="popup-desc">{activeDay.day.description}</p>
                  <Link
                    to={`/tour/${activeDay.route.slug}`}
                    className="popup-link"
                  >
                    查看完整行程 →
                  </Link>
                </div>
              </div>
            </div>
          )}
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