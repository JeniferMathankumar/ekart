package com.testapi.ekart.model;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
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

public class CategoryRequest {
	@NotBlank(message ="Category name is required")
	private String name;
	private String description;
	private MultipartFile imageUrl;
}
