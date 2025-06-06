"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { type Product, useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleAddToCart = () => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Debes iniciar sesión para añadir productos al carrito.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    // Simulate a delay for better UX
    setTimeout(() => {
      addItem(product)
      setIsLoading(false)
      toast({
        title: "Producto añadido",
        description: `${product.name} ha sido añadido al carrito.`,
      })
    }, 500)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <Link href={`/productos/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-grow">
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="font-medium text-primary-foreground">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={isLoading}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? "Añadiendo..." : "Añadir al carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}
