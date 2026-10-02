import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import data from '../data.json'
import '../styles/map.css'

export default function MapGuide() {
  const routesData = data.routes 
  // 1. 篩選條件 State 宣告
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. 從原始資料中動態提取「國家清單」與「難易度清單」（供下拉選單使用）
  const countryOptions = useMemo(() => {
    const countries = routesData.map((item) => item.country);
    return ['All', ...Array.from(new Set(countries))];
  }, []);

  const difficultyOptions = useMemo(() => {
    const difficulties = routesData.map((item) => item.difficulty);
    return ['All', ...Array.from(new Set(difficulties))];
  }, []);

  // 3. 核心篩選邏輯：使用 useMemo 確保僅在條件變更時重新計算
  const filteredRoutes = useMemo(() => {
    return routesData.filter((route) => {
      // 國家篩選
      const matchCountry =
        selectedCountry === 'All' || route.country === selectedCountry;

      // 難易度篩選
      const matchDifficulty =
        selectedDifficulty === 'All' || route.difficulty === selectedDifficulty;

      // 關鍵字搜尋（比對中文名、英文名、簡介）
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        route.name.toLowerCase().includes(query) ||
        route.englishName.toLowerCase().includes(query) ||
        route.summary.toLowerCase().includes(query);

      return matchCountry && matchDifficulty && matchSearch;
    });
  }, [selectedCountry, selectedDifficulty, searchQuery]);

  // 4. 重置所有篩選器
  const handleResetFilters = () => {
    setSelectedCountry('All');
    setSelectedDifficulty('All');
    setSearchQuery('');
  };

  return (
    <div className="catalog-container">
      {/* 頁面標題 */}
      <header className="catalog-header">
        <h1>探索全球頂級健行路線</h1>
        <p>挑選屬於你的下一次冒險，精選 4 國最具代表性的世界級步道</p>
      </header>

      {/* 篩選與搜尋工具列 */}
      <section className="filter-bar">
        <div className="filter-group">
          <label htmlFor="search-input">關鍵字搜尋：</label>
          <input
            id="search-input"
            type="text"
            placeholder="搜尋路線名稱或關鍵字..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="country-select">國家：</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="filter-select"
          >
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country === 'All' ? '全部國家' : country}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty-select">難易度：</label>
          <select
            id="difficulty-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            {difficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {diff === 'All' ? '全部難易度' : diff}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleResetFilters} className="reset-btn">
          重置條件
        </button>
      </section>

      {/* 結果統計數字 */}
      <div className="results-count">
        顯示 <strong>{filteredRoutes.length}</strong> / {routesData.length} 條符合條件的路線
      </div>

      {/* 響應式卡片網格區域 */}
      {filteredRoutes.length > 0 ? (
        <div className="routes-grid">
          {filteredRoutes.map((route) => (
            <article key={route.id} className="route-card">
              <div className="card-image-wrapper">
                <img
                  src={route.heroImage}
                  alt={route.name}
                  loading="lazy"
                  className="card-image"
                />
                <span className={`badge difficulty-${route.difficulty.toLowerCase()}`}>
                  {route.difficulty}
                </span>
                <span className="badge country-badge">{route.country}</span>
              </div>

              <div className="card-content">
                <h2 className="card-title">{route.name}</h2>
                <p className="card-subtitle">{route.englishName}</p>

                <p className="card-summary">{route.summary}</p>

                {/* 路線指標 */}
                <div className="card-metrics">
                  <div className="metric">
                    <span className="metric-label">距離</span>
                    <span className="metric-value">{route.distanceKm} km</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">預估天數</span>
                    <span className="metric-value">{route.durationDays}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">最高海拔</span>
                    <span className="metric-value">{route.maxElevationM} m</span>
                  </div>
                </div>

                {/* 標籤 */}
                <div className="card-tags">
                  {route.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 前往詳情頁按鈕 */}
                <Link to={`/tour/${route.slug}`} className="details-btn">
                  查看詳情與行程 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* 無符合結果時的 Empty State */
        <div className="empty-state">
          <h3>查無符合條件的健行路線</h3>
          <p>請嘗試調整搜尋關鍵字或放寬篩選條件</p>
          <button onClick={handleResetFilters} className="reset-btn-large">
            清除所有篩選
          </button>
        </div>
      )}
    </div>
  );
}