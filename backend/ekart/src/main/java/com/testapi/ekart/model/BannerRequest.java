package com.testapi.ekart.model;

import org.springframework.web.multipart.MultipartFile;

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
public class BannerRequest {
	@NotNull(message = "Banner image is required")
	private MultipartFile bannerImg;
	
	@NotBlank(message ="Banner name is required")
	private String title;
	private String description;
}
