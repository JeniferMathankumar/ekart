package com.testapi.ekart.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.testapi.ekart.entity.Product;
import com.testapi.ekart.entity.Slider_Images;
import com.testapi.ekart.entity.User;
import com.testapi.ekart.exception.ResourceNotFoundException;
import com.testapi.ekart.model.ProductResponse;
import com.testapi.ekart.model.ProfileRequest;
import com.testapi.ekart.model.ProfileResponse;
import com.testapi.ekart.model.BannerRequest;
import com.testapi.ekart.model.BannerResponse;
import com.testapi.ekart.repository.BannerRepository;
import com.testapi.ekart.service.BannerService;
import com.testapi.ekart.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BannerServiceImpl implements BannerService {

    private final FileStrorageServiceImpl fileStrorageServiceImpl;

	private final BannerRepository bannerRepository;
	private final FileStorageService fileStorageService;
	String folderName = "banners";
	String bannerStr = "";

	@Override
	public List<BannerResponse> getBannerImages() {
		// TODO Auto-generated method stub
		log.info("BANNERS SERVICE");
		return bannerRepository.findAll()
				.stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public BannerResponse createbanners(BannerRequest banner) {
		// TODO Auto-generated method stub
		
		try {
			bannerStr = fileStorageService.uploadImage(banner.getBannerImg(), folderName);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Slider_Images slider = Slider_Images.builder()
				.title(banner.getTitle())
				.description(banner.getDescription())
				.bannerImg("/uploads/" + folderName + "/"  + bannerStr)
				.active(true)
				.build();
		
		Slider_Images ban =  bannerRepository.save(slider);
		return mapToResponse(ban);
	}
	@Override
	public BannerResponse bannerUpdate(Long id, BannerRequest request) {
		// TODO Auto-generated method stub
		
	   Slider_Images banner = bannerRepository.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Banner","id",id));
		
		if (request.getBannerImg() != null) {
			try {
				bannerStr = fileStorageService.uploadImage(request.getBannerImg(), folderName);
				banner.setBannerImg("/uploads/" + folderName + "/"  + bannerStr);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		banner.setTitle(request.getTitle());
		banner.setDescription(request.getDescription());
		
		Slider_Images ban =  bannerRepository.save(banner);
		
		
		return  mapToResponse(ban);
	}


	@Override
	public boolean deleteBanners(Long id) {
		// TODO Auto-generated method stub
		
		Slider_Images slider = bannerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Banner","id", id));

			bannerRepository.deleteById(id);
			return true;
	}
	
	private BannerResponse mapToResponse(Slider_Images saved) {
		// TODO Auto-generated method stub
		return BannerResponse.builder()
				.id(saved.getId())
				.title(saved.getTitle())
				.bannerImg(saved.getBannerImg())
				.description(saved.getDescription())
				.active(saved.isActive())
				.createdAt(saved.getCreatedAt())
				.build();
	
	}


}
