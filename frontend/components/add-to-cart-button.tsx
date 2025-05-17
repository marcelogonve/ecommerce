"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { type Product, useCart } from "@/lib/cart-context"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

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

    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }

    // Show success toast
    toast({
      title: "Producto añadido",
      description: `${quantity} x ${product.name} ha sido añadido al carrito.`,
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      {isAuthenticated && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button variant="outline" size="icon" onClick={increaseQuantity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button className="w-full" onClick={handleAddToCart} disabled={isLoading}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "Añadiendo..." : "Añadir al carrito"}
      </Button>
    </div>
  )
}
