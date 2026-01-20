import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session, AuthResponse } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<AuthResponse['data']>
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log('Checking if user exists for:', email)
    
    // First check if user exists using our custom function
    const { data: userExists, error: checkError } = await supabase
      .rpc('check_user_exists', { email_to_check: email })
    
    console.log('User check result:', { userExists, checkError })
    
    if (checkError) {
      console.error('User check error:', checkError)
      throw new Error(`Database error: ${checkError.message}`)
    }
    
    if (userExists) {
      throw new Error('This email is already registered. Please sign in instead.')
    }
    
    console.log('User does not exist, proceeding with signup')
    
    // Now attempt signup
    const { error, data } = await supabase.auth.signUp({ email, password })
    
    console.log('Signup result:', { error, data })
    
    if (error) {
      throw new Error(error.message)
    }
    
    // Check if user needs email confirmation
    if (data?.user && !data.user.confirmed_at) {
      console.log('Please confirm your email to complete signup')
    }
    
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
    } catch (err) {
      const error = err as Error
      if (error.message.includes('Auth session missing')) {
        // Clear local storage manually since signOut failed
        const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
        localStorage.removeItem(`sb-${projectRef}-auth-token`)
      } else {
        throw error
      }
    }
    // Manually update state to ensure UI updates even if listener doesn't fire
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
