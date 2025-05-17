"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { fetchProducts, type Product } from "@/lib/api"
import ProductList from "@/components/product-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const [totalPages, setTotalPages] = useState(1)

  // Obtener categorías únicas
  const categories =
    allProducts.length > 0
      ? ["Todas", ...Array.from(new Set(allProducts.map((product) => product.category)))]
      : ["Todas"]

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const data = await fetchProducts()
        setAllProducts(data)
        setFilteredProducts(data)

        // Establecer el rango de precios basado en los productos
        if (data.length > 0) {
          const maxPrice = Math.ceil(Math.max(...data.map((p) => p.price)))
          setPriceRange([0, maxPrice])
        }
      } catch (err) {
        setError("Error al cargar los productos. Por favor, intenta de nuevo más tarde.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...allProducts]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== "Todas") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Filtrar por rango de precio
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    setFilteredProducts(result)
    setCurrentPage(1) // Resetear a la primera página cuando cambian los filtros
  }, [searchTerm, selectedCategory, priceRange, allProducts])

  // Actualizar productos mostrados según la paginación
  useEffect(() => {
    const totalFilteredPages = Math.ceil(filteredProducts.length / productsPerPage)
    setTotalPages(totalFilteredPages || 1)

    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex))
  }, [filteredProducts, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La búsqueda ya se aplica en el useEffect
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedCategory("")
    const maxPrice = Math.ceil(Math.max(...allProducts.map((p) => p.price)))
    setPriceRange([0, maxPrice])
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Generar array de páginas para mostrar en la paginación
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Mostrar un subconjunto de páginas con elipsis
      if (currentPage <= 3) {
        // Cerca del inicio
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("ellipsis")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Cerca del final
        pageNumbers.push(1)
        pageNumbers.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // En medio
        pageNumbers.push(1)
        pageNumbers.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("ellipsis")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-destructive">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Todos los productos</h1>
        <p className="text-muted-foreground">Explora nuestra selección de artículos deportivos de alta calidad</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filtros */}
        <div className="space-y-6 rounded-lg border p-4">
          <div>
            <h3 className="mb-4 text-lg font-medium">Filtros</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rango de precio</Label>
            <div className="pt-4">
              <Slider defaultValue={[0, 500]} max={500} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleReset}>
            Restablecer filtros
          </Button>
        </div>

        {/* Lista de productos */}
        <div className="md:col-span-3 space-y-6">
          {filteredProducts.length > 0 ? (
            <>
              <ProductList products={displayedProducts} />

              {/* Paginación */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) =>
                      page === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page as number)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg">No se encontraron productos que coincidan con los filtros.</p>
              <Button className="mt-4" variant="outline" onClick={handleReset}>
                Restablecer filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
