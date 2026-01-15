import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
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
    // First, try to sign in to check if email exists
    const { error: signInError } = await supabase.auth.signInWithPassword({ 
      email, 
      password: 'check' // dummy password, just checking if email exists
    })
    
    // If we get "Invalid login credentials" and email exists, the email is already registered
    if (signInError && (signInError.message.includes('Invalid login credentials') || 
        signInError.message.includes('invalid') || 
        signInError.message.includes('email'))) {
      // Email might exist, try to check by attempting signup
      const { error: signUpError, data } = await supabase.auth.signUp({ email, password })
      
      if (signUpError?.message.includes('already registered') || 
          signUpError?.message.includes('User already exists') ||
          signUpError?.message.includes('duplicate')) {
        throw new Error('This email is already registered. Please sign in instead.')
      }
      
      if (signUpError) {
        throw new Error(signUpError.message)
      }
      
      return data
    }
    
    // If email doesn't seem to exist, do normal signup
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) {
      if (error.message.includes('already registered') || 
          error.message.includes('User already exists') ||
          error.message.includes('duplicate key')) {
        throw new Error('This email is already registered. Please sign in instead.')
      }
      throw new Error(error.message)
    }
    
    // Check if user needs email confirmation
    if (data?.user && !data.user.confirmed_at) {
      console.log('Please confirm your email to complete signup')
    }
    
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
