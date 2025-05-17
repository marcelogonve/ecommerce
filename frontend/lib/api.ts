import { useAuthStore } from "./auth-store"

const API_BASE_URL = "http://localhost:8090/api"

// Función para refrescar el token
export async function refreshToken(): Promise<boolean> {
  const refreshToken = useAuthStore.getState().refreshToken

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      // Añadir configuración CORS
      mode: "cors",
      credentials: "include",
    })

    if (!response.ok) {
      // Si no se puede refrescar el token, limpiamos la autenticación
      useAuthStore.getState().clearAuth()
      return false
    }

    const data = await response.json()
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
    return true
  } catch (error) {
    console.error("Error al refrescar el token:", error)
    useAuthStore.getState().clearAuth()
    return false
  }
}

// Función para hacer peticiones autenticadas con manejo de refresh token
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const { accessToken } = useAuthStore.getState()

  // Configuración base para todas las peticiones
  const baseOptions: RequestInit = {
    ...options,
    mode: "cors",
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  }

  // Si no hay token, hacemos la petición sin autenticación
  if (!accessToken) {
    return fetch(`${API_BASE_URL}${url}`, baseOptions)
  }

  // Añadimos el token a los headers
  const authOptions = {
    ...baseOptions,
    headers: {
      ...baseOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await fetch(`${API_BASE_URL}${url}`, authOptions)

  // Si recibimos un 401, intentamos refrescar el token
  if (response.status === 401) {
    const refreshed = await refreshToken()

    // Si se pudo refrescar el token, reintentamos la petición
    if (refreshed) {
      const newAccessToken = useAuthStore.getState().accessToken

      const newAuthOptions = {
        ...baseOptions,
        headers: {
          ...baseOptions.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      }

      return fetch(`${API_BASE_URL}${url}`, newAuthOptions)
    }
  }

  return response
}

// Función para obtener el perfil del usuario
export async function fetchUserProfile(): Promise<User | null> {
  try {
    const response = await fetchWithAuth("/users/profile")

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error)
    return null
  }
}

// Función para cerrar sesión
export async function logoutUser(): Promise<boolean> {
  const { accessToken } = useAuthStore.getState()

  if (!accessToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      mode: "cors",
      credentials: "include",
    })

    // El backend responde con 204 (No Content) si el logout fue exitoso
    return response.status === 204
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return false
  }
}

// Función para obtener todos los productos
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      mode: "cors",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Error al obtener los productos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener los productos:", error)
    return []
  }
}

// Tipos
export type User = {
  id: string | number
  username: string
  email: string
  firstName: string
  lastName: string
  address: string
  birthDate: string
}

export type Product = {
  id: number | string
  name: string
  price: number
  image: string
  category: string
  description: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
}

export type RegisterData = {
  username: string
  firstName: string
  lastName: string
  birthDate: string
  email: string
  password: string
  address: string
}

// Función para iniciar sesión
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    mode: "cors",
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Credenciales inválidas")
  }

  return await response.json()
}

// Función para registrar un usuario
export async function register(userData: RegisterData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    mode: "cors",
    credentials: "include",
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Error al registrar usuario")
  }
}
