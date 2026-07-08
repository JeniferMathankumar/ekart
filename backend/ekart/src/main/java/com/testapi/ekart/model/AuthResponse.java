package com.testapi.ekart.model;

import java.util.Date;

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
public class AuthResponse {
	private String username;
	private String token;
	private String role;
	private String email;
	private String profileimage;
	private Date tokenExpiry;
	private String message;

}
