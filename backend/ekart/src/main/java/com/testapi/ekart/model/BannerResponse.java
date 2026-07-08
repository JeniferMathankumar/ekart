package com.testapi.ekart.model;

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
public class BannerResponse {
	private Long id;
	private String bannerImg;
	private String title;
	private String description;
	private boolean active;
	private LocalDateTime createdAt;
}
