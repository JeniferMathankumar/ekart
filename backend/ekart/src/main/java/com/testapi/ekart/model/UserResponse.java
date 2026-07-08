package com.testapi.ekart.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor 
@Getter
@Setter
@Builder
public class UserResponse {
	private Long id;
	private String username;
	private String role;
	private String email;
	private String profileimage;
	private boolean isActive;
}
