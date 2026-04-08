import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Scholarships from './pages/Scholarships'
import ScholarshipDetail from './pages/ScholarshipDetail'
import ScrollToTop from './components/ScrollToTop'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/scholarship/:id" element={<ScholarshipDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
