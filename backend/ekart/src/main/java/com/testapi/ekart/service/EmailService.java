package com.testapi.ekart.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
	private final JavaMailSender mailsender;
	
	public void sendEmail(String to,
			String subject,
			String body) {
		
		SimpleMailMessage message = new SimpleMailMessage();
		
		message.setText(body);
		message.setTo(to);
		message.setSubject(subject);
		
		mailsender.send(message);
		
		
	}
	 public void sendOtpMail(String toEmail, String otp) {

	        SimpleMailMessage message = new SimpleMailMessage();

	        message.setTo(toEmail);
	        message.setSubject("Password Reset OTP");

	        message.setText(
	                "Dear Customer,\n\n" +
	                "Your OTP for password reset is : " + otp +
	                "\n\nOTP valid for 5 minutes."
	        );

	        mailsender.send(message);
	    }

	public void sendPasswordResetEmail(String email, String tokenValue) {
		// TODO Auto-generated method stub
		
		
		
	}

}
