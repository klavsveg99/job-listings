import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { Header } from './components/Header'
import { JobBoard } from './components/JobBoard'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#667eea' }}>Loading...</div>
  }

  return (
    <>
      {user ? (
        <>
          <Header />
          <JobBoard />
        </>
      ) : (
        <Auth />
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
