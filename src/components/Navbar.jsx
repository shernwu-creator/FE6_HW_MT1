import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import '../styles/navbar.css'
import Logo from '/Travel_LOGO_0916.png'
import LogoWord from '/logo_word.png'

const links = [
  { to: '/', text: '首頁' },
  { to: '/map', text: '地圖導覽' },
  { to: '/gear', text: '裝備清單' },
  { to: '/safety', text: '登山安全' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(prev => !prev)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = (e) => {
      if (e.matches) {setIsOpen(false)};
    }
    mediaQuery.addEventListener('change',handleChange);
    return() => {
      mediaQuery.removeEventListener('change', handleChange);
    }
  },[])

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>
          <img src={Logo} alt="logo" className='navbar-logo-img' />
          <img src={LogoWord} alt="logo word" className='logo-word' />
        </Link>
      </div>

      {/* 桌機 + 手機共用同一份 ul，靠 CSS 控制顯示 */}
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* 漢堡按鈕：只在手機顯示 */}
      <button
        className="mobile-menu"
        onClick={toggleMenu}
        aria-label="切換選單"
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  )
}