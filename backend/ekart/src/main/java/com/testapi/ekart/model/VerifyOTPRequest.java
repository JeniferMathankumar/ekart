package com.testapi.ekart.model;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class VerifyOTPRequest {
	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;
	
	@Size(max = 6, message = "OTP should contains 6-digit")
	private String otp;
}
