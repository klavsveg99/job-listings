import { useAuth } from '../contexts/AuthContext'
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
        <h1>Job Board</h1>
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
