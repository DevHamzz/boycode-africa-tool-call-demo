import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Activity from './pages/Activity'
import Settings from './pages/Settings'
import Login from './pages/Login'

export default function App() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={
          <AnimatePresence mode="wait">
            <Dashboard key="dashboard" />
          </AnimatePresence>
        } />
        <Route path="chat" element={
          <AnimatePresence mode="wait">
            <Chat key="chat" />
          </AnimatePresence>
        } />
        <Route path="activity" element={
          <AnimatePresence mode="wait">
            <Activity key="activity" />
          </AnimatePresence>
        } />
        <Route path="settings" element={
          <AnimatePresence mode="wait">
            <Settings key="settings" />
          </AnimatePresence>
        } />
      </Route>
    </Routes>
  )
}
