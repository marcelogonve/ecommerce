import { products } from "@/lib/data"
import ProductList from "@/components/product-list"

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Todos los productos</h1>
        <p className="text-muted-foreground">Explora nuestra selección de artículos deportivos de alta calidad</p>
      </div>

      <ProductList products={products} />
    </div>
  )
}
