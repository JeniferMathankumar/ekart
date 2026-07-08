package com.testapi.ekart.service;

import java.util.List;

import com.testapi.ekart.model.DashboardResponse;
import com.testapi.ekart.model.ProductRequest;
import com.testapi.ekart.model.ProductResponse;

public interface ProductService {
	ProductResponse createProduct(ProductRequest request);
	List<ProductResponse> getAllProducts();
	ProductResponse getProductById(Long id);
	ProductResponse updateProduct(Long id, ProductRequest request);
	boolean deleteProduct(Long id);
	DashboardResponse getDashboard();
}
