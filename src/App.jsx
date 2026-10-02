import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import MapGuide from './pages/MapGuide'
import Gear from './pages/Gear'
import Safety from './pages/Safety'
import TourDetail from './pages/TourDetail'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapGuide />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/tour/:slug" element={<TourDetail />} />
      </Route>
    </Routes>
  )
}