package com.testapi.ekart.model;

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
public class CategoryResponse {
	private Long id;
	private String name;
	private String description;
	private String imageUrl;
	private int productcount;
}
