import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './routes/Home'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Dashboard from './routes/Dashboard'
import Note from './routes/Note'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }  
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <Note />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App