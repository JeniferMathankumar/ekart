package com.testapi.ekart.model;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor 
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProductRequest {

	@NotBlank(message = "Name is required")
	private String name;
	
	private String description;
	
	@NotNull(message = "Price is required")
	@DecimalMin(value = "0.0",inclusive = false, message = "Price must be greater than 0")
	private BigDecimal price;
	
	@NotNull(message = "Stock is required")
	@Min(message = "Stock cannot be negative", value = 0)
	private Integer stock;
	
	@NotNull(message = "Category ID is required")
	private Long categoryId;
	
	private MultipartFile imageUrl;
}
