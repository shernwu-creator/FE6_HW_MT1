import React from 'react'
// import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* basename 必須等於 Vite 的 base（例如 GitHub Pages 的 /FE6_HW_MT1/），
        否則在子路徑部署時路由會對不上而顯示空白 */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App /> 
    </BrowserRouter>
  </React.StrictMode>,
)
