package com.testapi.ekart.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testapi.ekart.entity.Slider_Images;
import com.testapi.ekart.model.ApiResponse;
import com.testapi.ekart.model.BannerRequest;
import com.testapi.ekart.repository.BannerRepository;
import com.testapi.ekart.service.BannerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;
    private final BannerRepository bannerRepository;

    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<List<Slider_Images>>> getAllImages() {
        return ResponseEntity.ok(mapToResponse(bannerService.getBannerImages(),HttpStatus.OK,"Banners fetched successfully"));
    }

    @PostMapping("/admin/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Slider_Images>> createBanner(@Valid @ModelAttribute BannerRequest bannerRequest) {
    	
        return ResponseEntity.ok(mapToResponse( bannerService.createbanners(bannerRequest),HttpStatus.OK,"Banners created successfully"));
    }
    
    @PutMapping("/admin/banners/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Slider_Images>> updateBanner(@Valid @PathVariable Long id, @ModelAttribute BannerRequest bannerRequest) {
    	
        return ResponseEntity.ok(mapToResponse( bannerService.bannerUpdate(id,bannerRequest),HttpStatus.OK,"Banners updated successfully"));
    }

    @DeleteMapping("/admin/banners/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteBanner(@PathVariable Long id) {
    
    	if(bannerService.deleteBanners(id)) {
			
    		return ResponseEntity.ok(ApiResponse
    				.builder()
    				.message("Banner deleted successfully")
    				.status(true)
    				.statusCode(HttpStatus.OK.value())
    				.build());
    		}
    		return ResponseEntity.ok(null);
    }
    public <T> ApiResponse mapToResponse(T response, HttpStatusCode code, String message) {

		return ApiResponse.builder()
				.message(!message.isEmpty() ? message : "Successfully Fetched!")
				.status(true)
				.statusCode(code.value())
				.errors(null)
				.data(response).build();

	}
	
}