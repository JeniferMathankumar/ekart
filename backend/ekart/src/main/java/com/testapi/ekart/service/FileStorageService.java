package com.testapi.ekart.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
	String uploadImage(MultipartFile file, String foldername) throws Exception;
}
