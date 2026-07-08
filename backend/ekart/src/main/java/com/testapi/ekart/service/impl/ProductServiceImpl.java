package com.testapi.ekart.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.testapi.ekart.entity.Category;
import com.testapi.ekart.entity.Product;
import com.testapi.ekart.exception.ResourceNotFoundException;
import com.testapi.ekart.model.DashboardResponse;
import com.testapi.ekart.model.ProductRequest;
import com.testapi.ekart.model.ProductResponse;
import com.testapi.ekart.repository.CategoryRepository;
import com.testapi.ekart.repository.BannerRepository;
import com.testapi.ekart.repository.ProductRepository;
import com.testapi.ekart.service.FileStorageService;
import com.testapi.ekart.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	
	public final ProductRepository productRepository;
	
	public final CategoryRepository categoryRepository;
	private final FileStorageService fileStorageService;
	private final BannerRepository bannerRepository;
	String folderName = "products";
	String imaString = "";
	@Override
	public ProductResponse createProduct(ProductRequest request) {
		// TODO Auto-generated method stub
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category","Id",request.getCategoryId()));

		try {
			imaString = fileStorageService.uploadImage(request.getImageUrl(), folderName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Product product = Product.builder()
				.name(request.getName())
				.description(request.getDescription())
				.stock(request.getStock())
				.price(request.getPrice())
				.imageUrl("/uploads/" + folderName + "/"  + imaString)
				.category(category)
				.build();
		Product saved = productRepository.save(product);
				log.info("Product created successfully :{}",saved.getName());
		return mapToResponse(saved);
	}

	private ProductResponse mapToResponse(Product saved) {
		// TODO Auto-generated method stub
		return ProductResponse.builder()
				.id(saved.getId())
				.name(saved.getName())
				.description(saved.getDescription())
				.categoryId(saved.getCategory().getId())
				.categoryName(saved.getCategory().getName())
				.stock(saved.getStock())
				.price(saved.getPrice())
				.imageUrl(saved.getImageUrl())
				.createdAt(saved.getCreatedAt())
				.build();
	
	}

	@Override
	public List<ProductResponse> getAllProducts() {
		// TODO Auto-generated method stub
		
		return productRepository.findAll()
				.stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public ProductResponse getProductById(Long id) {
		// TODO Auto-generated method stub
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product", "ID", id));
		return mapToResponse(product);
	}

	@Override
	public ProductResponse updateProduct(Long id, ProductRequest request) {
		// TODO Auto-generated method stub
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category","id",request.getCategoryId()));
		
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product","id",id));
		
		if (request.getImageUrl() != null) {
			try {
				imaString = fileStorageService.uploadImage(request.getImageUrl(), folderName);
				product.setImageUrl("/uploads/" + folderName + "/"  + imaString);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setStock(request.getStock());
		product.setCategory(category);
		
		Product updated = productRepository.save(product);
		return mapToResponse(updated);
	}

	@Override
	@Transactional
	public boolean deleteProduct(Long id) {
		// TODO Auto-generated method stub
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product","id",id));
				productRepository.delete(product);
				log.info("Product deleted id : {}",id);
				return true;
	}
	
	@Override
	public DashboardResponse getDashboard() {
		// TODO Auto-generated method stub
		return new DashboardResponse(
	            productRepository.count(),
	            categoryRepository.count(),
	            bannerRepository.count()
	    );
	}
	
	

}
