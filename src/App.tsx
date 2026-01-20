import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Auth } from './components/Auth'
import { Header } from './components/Header'
import { JobBoard } from './components/JobBoard'
import { ThemeToggle } from './components/ThemeToggle'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <>
        <ThemeToggle />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Loading...</div>
      </>
    )
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
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
