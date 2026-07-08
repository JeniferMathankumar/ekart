package com.testapi.ekart.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class ProductResponse {
	
	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private Integer stock;
	private Long categoryId;
	private String categoryName;
	private LocalDateTime createdAt;
	private String imageUrl;
	
}
