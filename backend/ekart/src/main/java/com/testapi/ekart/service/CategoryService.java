package com.testapi.ekart.service;

import java.util.List;

import com.testapi.ekart.model.CategoryRequest;
import com.testapi.ekart.model.CategoryResponse;

public interface CategoryService {
	CategoryResponse createCategory(CategoryRequest request);
	List<CategoryResponse> getAllCategories();
	CategoryResponse getCategoryById(Long id);
	CategoryResponse updateCategory(Long id, CategoryRequest request);
	boolean deleteCategory(Long id);
}
