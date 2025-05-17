"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { fetchProducts, type Product } from "@/lib/api"
import AddToCartButton from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      try {
        const products = await fetchProducts()
        const foundProduct = products.find((p) => p.id.toString() === params.id)

        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          setError("Producto no encontrado")
          setTimeout(() => {
            router.push("/productos")
          }, 2000)
        }
      } catch (err) {
        setError("Error al cargar el producto")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Cargando producto...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-destructive">{error || "Producto no encontrado"}</p>
        <p className="mt-2">Redirigiendo a la página de productos...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/productos">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a productos
        </Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg font-semibold text-primary-foreground">${product.price.toFixed(2)}</p>
            <div className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {product.category}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}
