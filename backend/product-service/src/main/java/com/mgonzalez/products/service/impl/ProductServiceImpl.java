package com.mgonzalez.products.service.impl;

import com.mgonzalez.products.entity.Product;
import com.mgonzalez.products.repository.ProductRepository;
import com.mgonzalez.products.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}
