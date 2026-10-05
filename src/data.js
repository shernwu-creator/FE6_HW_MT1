import rawData from './data.json'

// Vite 的 BASE_URL 會自動帶出部署路徑前綴
// （GitHub Pages 為 '/FE6_HW_MT1/'、Netlify 為 '/'）。
// data.json 內的圖片是以 '/' 開頭的絕對路徑，若不在執行時補上前綴，
// 部署到子路徑（GitHub Pages）後會 404 而破圖。
const withBase = (path) => {
  if (typeof path !== 'string' || !path.startsWith('/')) return path
  return `${import.meta.env.BASE_URL}${path.slice(1)}`
}

const routes = rawData.routes.map((route) => ({
  ...route,
  heroImage: withBase(route.heroImage),
  heroImage2: withBase(route.heroImage2),
  heroImage3: withBase(route.heroImage3),
  itinerary: route.itinerary.map((day) => ({
    ...day,
    image: withBase(day.image),
  })),
}))

export default { ...rawData, routes }
