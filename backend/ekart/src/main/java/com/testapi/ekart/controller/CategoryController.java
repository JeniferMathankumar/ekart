package com.testapi.ekart.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.testapi.ekart.model.ApiResponse;
import com.testapi.ekart.model.AuthResponse;
import com.testapi.ekart.model.CategoryRequest;
import com.testapi.ekart.model.CategoryResponse;
import com.testapi.ekart.model.BannerResponse;
import com.testapi.ekart.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

	private final CategoryService categoryService;

	
	@PostMapping("/api/admin/categories")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @ModelAttribute CategoryRequest request){
		CategoryResponse response =  categoryService.createCategory(request);
		return ResponseEntity.ok(mapToResponse(response,HttpStatus.CREATED,"Successfully Fetched!"));
	}
	
	@PutMapping("/api/admin/categories/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id,@Valid @ModelAttribute CategoryRequest request){
		CategoryResponse categoryResponse = categoryService.updateCategory(id, request);
		return ResponseEntity.ok(mapToResponse(categoryResponse,HttpStatus.OK,"Category updated successfully!"));
	}
	
	@DeleteMapping("/api/admin/categories/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id){
		if(categoryService.deleteCategory(id)) {
			ApiResponse apiresponse = ApiResponse.builder()
					.data(null)
					.errors(null)
					.status(true)
					.statusCode(HttpStatus.OK.value())
					.message("Category deleted successfully")
					.build();
			return ResponseEntity.ok(apiresponse);
		}
		ApiResponse apiresponse = ApiResponse.builder()
				.data(null)
				.errors(null)
				.status(true)
				.statusCode(HttpStatus.BAD_REQUEST.value())
				.message("Something went wrong.")
				.build();
		return ResponseEntity.ok(apiresponse);
	}
	
	@GetMapping("/api/categories")
	public ResponseEntity<ApiResponse> getAllCategories(){
		return ResponseEntity.ok(mapToResponse(categoryService.getAllCategories(),HttpStatus.OK,"Categories listed successfully!"));
	}

	
	@GetMapping("/api/categories/{id}")
	public ResponseEntity<ApiResponse> getCategoriesById(@PathVariable Long id){
		CategoryResponse cat = categoryService.getCategoryById(id);
		return ResponseEntity.ok(mapToResponse(cat,HttpStatus.OK,"Category Found"));
	}
	
	public <T> ApiResponse mapToResponse(T response,HttpStatusCode code,String message) {
		return ApiResponse
				.builder()
				.message( message != null ? message :"Successfully Fetched!")
				.status(true)
				.statusCode(code.value())
				.errors(null)
				.data(response)
				.build();

	}
	
}
