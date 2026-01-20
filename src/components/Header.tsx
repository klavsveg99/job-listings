import { useAuth } from '../contexts/AuthContext'
import { ThemeToggle } from './ThemeToggle'
import './Header.css'

export const Header = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>Job Board</h1>
          <ThemeToggle variant="inline" />
        </div>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleSignOut} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
