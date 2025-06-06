"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Step = "credentials" | "personal"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("credentials")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { register } = useAuth()
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Formatear la fecha al formato YYYY-MM-DD
  const formatDate = (dateString: string): string => {
    if (!dateString) return ""

    // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "" // Fecha inválida

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")

      return `${year}-${month}-${day}`
    } catch (error) {
      console.error("Error al formatear la fecha:", error)
      return ""
    }
  }

  const handleNext = () => {
    if (step === "credentials") {
      // Validate credentials
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Campos incompletos",
          description: "Por favor completa todos los campos.",
          variant: "destructive",
        })
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Las contraseñas no coinciden",
          description: "Por favor verifica que las contraseñas sean iguales.",
          variant: "destructive",
        })
        return
      }

      setStep("personal")
    }
  }

  const handlePrevious = () => {
    if (step === "personal") {
      setStep("credentials")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate personal info
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.address) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    // Validar formato de fecha
    const formattedDate = formatDate(formData.birthDate)
    if (!formattedDate) {
      toast({
        title: "Fecha inválida",
        description: "Por favor ingresa una fecha válida en formato YYYY-MM-DD.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar los datos para enviar al servidor
      const userData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formattedDate,
        email: formData.email,
        password: formData.password,
        address: formData.address,
      }

      console.log("Enviando datos de registro:", userData)

      await register(userData)

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
      })

      // Redireccionar al usuario a la página de login
      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "Error al registrar",
        description: error instanceof Error ? error.message : "Ha ocurrido un error durante el registro",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear una cuenta</CardTitle>
          <CardDescription>Completa el formulario para registrarte en nuestra tienda</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === "credentials" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => updateFormData("username", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {step === "personal" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento (YYYY-MM-DD)</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData("birthDate", e.target.value)}
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Formato: YYYY-MM-DD (ej. 1990-01-31)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-center space-x-2">
              <span className={`h-2 w-2 rounded-full ${step === "credentials" ? "bg-primary" : "bg-muted"}`} />
              <span className={`h-2 w-2 rounded-full ${step === "personal" ? "bg-primary" : "bg-muted"}`} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex w-full space-x-2">
              {step !== "credentials" && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}

              {step !== "personal" ? (
                <Button type="button" onClick={handleNext} className="flex-1">
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Completar registro"}
                </Button>
              )}
            </div>

            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="text-primary-foreground hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
