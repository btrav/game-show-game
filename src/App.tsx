import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Builder from "./pages/Builder"
import Setup from "./pages/Setup"
import Play from "./pages/Play"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder/:id" element={<Builder />} />
        <Route path="/setup/:id" element={<Setup />} />
        <Route path="/play/:id" element={<Play />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
