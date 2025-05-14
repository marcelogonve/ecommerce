import Link from "next/link"
import { notFound } from "next/navigation"
import { products } from "@/lib/data"
import AddToCartButton from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
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
