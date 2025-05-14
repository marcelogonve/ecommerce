"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { toast } = useToast()

  const handleCheckout = () => {
    toast({
      title: "Procesando pedido",
      description: "Tu pedido está siendo procesado. Serás redirigido al pago.",
    })

    // In a real app, you would redirect to checkout
    setTimeout(() => {
      clearCart()
      toast({
        title: "Pedido completado",
        description: "¡Gracias por tu compra!",
      })
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">Parece que aún no has añadido ningún producto a tu carrito.</p>
        <Link href="/productos">
          <Button className="mt-6">Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Carrito de compras</h1>
        <p className="text-muted-foreground">Revisa tus productos y procede al pago</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-4 rounded-lg border p-4">
              <div className="h-16 w-16 overflow-hidden rounded-md">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <p className="font-medium text-primary-foreground">${item.product.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value))}
                  className="w-16"
                />
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearCart}>
              Vaciar carrito
            </Button>
            <Link href="/productos">
              <Button variant="outline">Seguir comprando</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold">Resumen del pedido</h2>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity} x {item.product.name}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleCheckout}>
            Proceder al pago
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
