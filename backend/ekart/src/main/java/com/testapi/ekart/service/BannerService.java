package com.testapi.ekart.service;

import java.util.List;

import com.testapi.ekart.model.BannerRequest;
import com.testapi.ekart.model.BannerResponse;


public interface BannerService {
	List<BannerResponse> getBannerImages();
	BannerResponse createbanners(BannerRequest banner);
	boolean deleteBanners(Long id);
	BannerResponse bannerUpdate(Long id, BannerRequest banner);
}
