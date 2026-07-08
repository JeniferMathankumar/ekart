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
@Builder
@Setter
@Getter

public class PasswordResetbyOtp {
	
	@NotBlank(message = "Password is required")
	@Size(min = 8,message = "Password  must be atleast 8 characters")
	private String newPassword;
	
	
	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;
}
