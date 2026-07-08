package com.testapi.ekart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testapi.ekart.model.ApiResponse;
import com.testapi.ekart.model.DashboardResponse;
import com.testapi.ekart.model.ProfileRequest;
import com.testapi.ekart.model.ProfileResponse;
import com.testapi.ekart.model.UserResponse;
import com.testapi.ekart.repository.UserRepository;
import com.testapi.ekart.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

	private final AuthService authService;
	private final UserRepository userRepository;

	@PutMapping(value = "/profile-update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<ProfileResponse>> profileUpdate(@Valid @ModelAttribute ProfileRequest request) {

		String mes = "Profile changed successfully";
		return ResponseEntity.ok(mapToResponse(authService.profileUpdate(request), HttpStatus.OK, mes));

	}
	
	@GetMapping("/admin/users")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<UserResponse>> getAllUsers() {
		return ResponseEntity.ok(mapToResponse(authService.getAllUsers(),HttpStatus.OK, "Users fetched successfully"));
	}
	
	@PostMapping("/admin/users/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(mapToResponse(authService.getUserById(id),HttpStatus.OK, "User fetched successfully"));
	}
	
	@DeleteMapping("/admin/users/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<UserResponse>> deleteUserById(@PathVariable Long id) {
		return ResponseEntity.ok(mapToResponse(authService.deleteUserById(id),HttpStatus.OK, "User deleted successfully"));
	}
	

	public <T> ApiResponse mapToResponse(T response, HttpStatusCode code, String message) {

		return ApiResponse.builder()
				.message(!message.isEmpty() ? message : "Successfully Changed!")
				.status(true)
				.statusCode(code.value())
				.errors(null)
				.data(response).build();

	}
	
}
