import { Link } from 'react-router-dom'
import '../styles/footer.css'
import LogoWord from '/logo_word.png'
import Logo from '/Travel_LOGO_0916.png'


export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-info">
          <div className="footer-brand">
            <img
              src={Logo}
              alt="PeakExplore Logo"
              className="footer-logo"
            />
            <img
              src={LogoWord}
              alt="Logo word"
              className="footer-logo-word"
            />
            <h3>全球健行</h3>
          </div>
          <p>
            精選 4 國頂級登山健行路線，提供專業行程資訊、互動地圖與裝備規劃工具。
          </p>
        </div>

        <div className="footer-links">
          <h4>快速連結</h4>
          <ul>
            <li><Link to="/">首頁</Link></li>
            <li><Link to="/map">地圖導覽</Link></li>
            <li><Link to="/gear">裝備清單</Link></li>
            <li><Link to="/safety">登山安全</Link></li>
          </ul>
        </div>

        <div className="footer-links footer-links2">
          <h4>精選路線</h4>
          <ul>
            <li><Link to="/tour/tour-du-mont-blanc">環白朗峰</Link></li>
            <li><Link to="/tour/inca-trail">印加古道</Link></li>
            <li><Link to="/tour/milford-track">米爾福德步道</Link></li>
            <li><Link to="/tour/kumano-kodo">熊野古道</Link></li>
          </ul>
        </div>

        {/* <div className="footer-course-info">
          <h4>專案資訊</h4>
          <p>前端網站開發人員認證課程專案</p>
          <p>技術棧：React 18 / React Router v6 / Vite</p>
        </div> */}
      </div>

      <div className="footer-bottom">
        <p>© 2026 PeakExplore. All rights reserved.</p>
      </div>
    </footer>
  )
}