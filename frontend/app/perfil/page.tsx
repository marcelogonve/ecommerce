"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { fetchUserProfile, type User } from "@/lib/api"
import { Loader2, UserIcon, Mail, Calendar, MapPin } from "lucide-react"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para ver tu perfil.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // Cargar los datos del perfil
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const userData = await fetchUserProfile()
        if (userData) {
          setProfileData(userData)
        } else {
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos del perfil.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar tu perfil.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [isAuthenticated, router, toast])

  if (!isAuthenticated) {
    return null // No renderizar nada mientras se redirige
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Cargando perfil...</p>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-destructive">No se pudieron cargar los datos del perfil.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Mi Perfil</h1>

      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/10 pb-8">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-4xl text-primary-foreground">
              {profileData.firstName?.charAt(0)}
              {profileData.lastName?.charAt(0)}
            </div>
            <CardTitle className="text-2xl">
              {profileData.firstName} {profileData.lastName}
            </CardTitle>
            <CardDescription>@{profileData.username}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ID de Usuario</p>
              <p className="flex items-center gap-2 font-medium">
                <UserIcon className="h-4 w-4 text-primary" />
                {profileData.id}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nombre de Usuario</p>
              <p className="flex items-center gap-2 font-medium">
                <UserIcon className="h-4 w-4 text-primary" />
                {profileData.username}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
              <p className="flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4 text-primary" />
                {profileData.email}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
              <p className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                {profileData.birthDate}
              </p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                {profileData.address}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
