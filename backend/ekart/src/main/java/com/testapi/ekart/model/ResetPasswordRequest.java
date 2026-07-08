package com.testapi.ekart.model;

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
@Getter
@Setter
public class ResetPasswordRequest {
	@NotBlank(message = "Token is required")
	private String token;
	
	@NotBlank(message = "Password is required")
	@Size(min = 8,message = "Password  must be atleast 8 characters")
	private String newPassword;

}
