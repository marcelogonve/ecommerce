package com.mgonzalez.products.controller;

import com.mgonzalez.products.entity.Product;
import com.mgonzalez.products.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Slf4j
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        log.info("### ENTRANDO A GETALLPRODUCTS ###");
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } finally {
            log.info("### SALIENDO DE GETALLPRODUCTS ###");
        }
    }

}
