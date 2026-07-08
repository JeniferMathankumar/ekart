package com.testapi.ekart.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.testapi.ekart.entity.Category;
import com.testapi.ekart.entity.Product;
import com.testapi.ekart.exception.BadRequestException;
import com.testapi.ekart.exception.ResourceNotFoundException;
import com.testapi.ekart.model.CategoryRequest;
import com.testapi.ekart.model.CategoryResponse;

import com.testapi.ekart.repository.CategoryRepository;
import com.testapi.ekart.repository.ProductRepository;
import com.testapi.ekart.service.CategoryService;
import com.testapi.ekart.service.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;
	private final ProductRepository productRepository;
	private final FileStorageService fileStorageService;
	String folderName = "categories";
	String imaString = "";

	@Override
	public CategoryResponse createCategory(CategoryRequest request) {
		// TODO Auto-generated method stub
		if (categoryRepository.existsByName(request.getName())) {
			throw new BadRequestException("Category already exists with name: " + request.getName());
		}

		try {
			imaString = fileStorageService.uploadImage(request.getImageUrl(), folderName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Category category = Category.builder()
				.description(request.getDescription())
				.name(request.getName())
				.imageUrl("/uploads/" + folderName + "/"  + imaString ).build();
		Category saved = categoryRepository.save(category);

		return mapToResponse(saved);
	}

	private CategoryResponse mapToResponse(Category saved) {
		// TODO Auto-generated method stub
		return CategoryResponse.builder()
				.id(saved.getId()).name(saved.getName())
				.description(saved.getDescription())
				.imageUrl(saved.getImageUrl())
				.productcount(productRepository.findByCategoryId(saved.getId()).size())
				.build();
	}

	@Override
	public List<CategoryResponse> getAllCategories() {
		// TODO Auto-generated method stub

		return categoryRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public CategoryResponse getCategoryById(Long id) {
		// TODO Auto-generated method stub
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
		return mapToResponse(category);
	}

	@Override
	public CategoryResponse updateCategory(Long id, CategoryRequest request) {
		// TODO Auto-generated method stub
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

		if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
			throw new BadRequestException("Category already exists with name: " + request.getName());
		}

		if (request.getImageUrl() != null) {
			try {
				imaString = fileStorageService.uploadImage(request.getImageUrl(), folderName);
				category.setImageUrl("/uploads/" + folderName + "/"  + imaString);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		category.setName(request.getName());
		category.setDescription(request.getDescription());

		Category updated = categoryRepository.save(category);
		log.info("Category Updated :{}", updated.getName());

		return mapToResponse(updated);
	}

	@Override
	public boolean deleteCategory(Long id) {
		// TODO Auto-generated method stub
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
		List<Product> product = productRepository.findByCategoryId(id);
		log.info("PRODUCT SIZE ", product.size());
		if (product.size() == 0) {
			categoryRepository.delete(category);
		} else {
			throw new BadRequestException("Category you have tried to delete has product.");
		}
		log.info("Category deleted: id={}", id);
		return true;
	}

}
