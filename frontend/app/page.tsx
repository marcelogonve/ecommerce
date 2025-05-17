"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductList from "@/components/product-list"
import { fetchProducts, type Product } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const products = await fetchProducts()
        // Mostrar solo los primeros 4 productos como destacados
        setFeaturedProducts(products.slice(0, 4))
      } catch (err) {
        setError("Error al cargar los productos")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="space-y-12">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Descubre lo mejor en artículos deportivos
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Equipamiento de alta calidad para todos tus deportes favoritos. Encuentra todo lo que necesitas para
                  mantenerte activo.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/productos">
                  <Button className="bg-primary text-primary-foreground">Ver productos</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Artículos deportivos"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Productos destacados</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Descubre nuestros productos más populares y mejor valorados
              </p>
            </div>
          </div>
          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg">Cargando productos destacados...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-destructive">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  Intentar de nuevo
                </Button>
              </div>
            ) : featuredProducts.length > 0 ? (
              <ProductList products={featuredProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg">No hay productos destacados disponibles en este momento.</p>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/productos">
              <Button variant="outline">Ver todos los productos</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">¿Por qué elegirnos?</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Ofrecemos la mejor calidad y servicio para nuestros clientes
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary p-3">
                <svg
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Calidad garantizada</h3>
              <p className="text-center text-muted-foreground">
                Todos nuestros productos son de la más alta calidad y durabilidad
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary p-3">
                <svg
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Atención personalizada</h3>
              <p className="text-center text-muted-foreground">
                Nuestro equipo está disponible para ayudarte a encontrar lo que necesitas
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary p-3">
                <svg
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 8h14" />
                  <path d="M5 12h14" />
                  <path d="M5 16h14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Amplio catálogo</h3>
              <p className="text-center text-muted-foreground">
                Encuentra todo lo que necesitas para tu deporte favorito en un solo lugar
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
