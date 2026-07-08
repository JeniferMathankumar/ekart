package com.testapi.ekart.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testapi.ekart.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {
	private final EmailService emailService;
	
	@PostMapping("/send")
	public String sendemail() {
		
		emailService.sendOtpMail(null, null);
		
		return "Mail Sent";
	}
}
