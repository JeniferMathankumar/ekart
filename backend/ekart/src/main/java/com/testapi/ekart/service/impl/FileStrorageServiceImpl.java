package com.testapi.ekart.service.impl;

import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.testapi.ekart.service.FileStorageService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class FileStrorageServiceImpl implements FileStorageService{
	
	@Override
	public String uploadImage(MultipartFile file, String foldername) throws IOException {
		// TODO Auto-generated method stub
		
		String uploadDir = "uploads/" + foldername;
		
		Path path = Paths.get(uploadDir);
		
		if(!Files.exists(path)) {
			Files.createDirectories(path);
		}
		
		String fileName = UUID.randomUUID()+
				         "_"+
				file.getOriginalFilename();
		
		Files.copy(file.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
				
		return fileName;
	}
	
}
