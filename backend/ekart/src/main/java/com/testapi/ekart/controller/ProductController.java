package com.testapi.ekart.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testapi.ekart.entity.Product;
import com.testapi.ekart.model.ApiResponse;
import com.testapi.ekart.model.ProductRequest;
import com.testapi.ekart.model.ProductResponse;
import com.testapi.ekart.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping
@RequiredArgsConstructor
public class ProductController {
	
	private final ProductService productService;
	
	
	@PostMapping("/api/admin/products")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<ProductResponse>> createproduct(@Valid @ModelAttribute ProductRequest request){
		ProductResponse response = productService.createProduct(request);
//		System
		return ResponseEntity.ok(mapToResponse(response,HttpStatus.CREATED));
	}
	
	@PutMapping("/api/admin/products/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<ProductResponse>> updateproduct(@PathVariable Long id, @Valid @ModelAttribute ProductRequest request){
		ProductResponse response = productService.updateProduct(id, request);
		return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK));
	}
	
	@DeleteMapping("/api/admin/products/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id){
		if(productService.deleteProduct(id)) {
			
		return ResponseEntity.ok(ApiResponse
				.builder()
				.message("Product deleted successfully")
				.status(true)
				.statusCode(HttpStatus.OK.value())
				.build());
		}
		return ResponseEntity.ok(null);
	}
	
	@GetMapping("/api/products")
	public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(){
		return ResponseEntity.ok(mapToResponse(productService.getAllProducts(),HttpStatus.OK));
	}
	
	@GetMapping("/api/products/{id}")
	public ResponseEntity<ApiResponse<ProductResponse>> getProductsById(@PathVariable Long id){
		return ResponseEntity.ok(mapToResponse(productService.getProductById(id),HttpStatus.OK));
	}
	
	public <T> ApiResponse mapToResponse(T response,HttpStatusCode code) {
		return ApiResponse
				.builder()
				.message("Successfully Fetched!")
				.status(true)
				.statusCode(code.value())
				.errors(null)
				.data(response)
				.build();

	}
	
}
