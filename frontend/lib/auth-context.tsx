"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useAuthStore, type User } from "@/lib/auth-store"
import { login, register, fetchUserProfile, type RegisterData } from "@/lib/api"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, setTokens, setUser, clearAuth, setLoading } = useAuthStore()

  // Cargar el perfil del usuario si está autenticado pero no tenemos sus datos
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && !user) {
        setLoading(true)
        try {
          const userProfile = await fetchUserProfile()
          if (userProfile) {
            setUser(userProfile)
          } else {
            // Si no se puede obtener el perfil, limpiamos la autenticación
            clearAuth()
          }
        } catch (error) {
          console.error("Error al cargar el perfil del usuario:", error)
          clearAuth()
        } finally {
          setLoading(false)
        }
      }
    }

    loadUserProfile()
  }, [isAuthenticated, user, setUser, clearAuth, setLoading])

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)

    try {
      // Realizar la petición de login
      const { accessToken, refreshToken } = await login(email, password)

      // Guardar los tokens en el store
      setTokens(accessToken, refreshToken)

      // Obtener el perfil del usuario
      const userProfile = await fetchUserProfile()

      if (userProfile) {
        setUser(userProfile)
      } else {
        throw new Error("No se pudo obtener el perfil del usuario")
      }
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData: RegisterData) => {
    setLoading(true)

    try {
      await register(userData)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
