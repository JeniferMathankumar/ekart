package com.testapi.ekart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testapi.ekart.model.ApiResponse;
import com.testapi.ekart.model.AuthResponse;
import com.testapi.ekart.model.ForgetPasswordRequest;
import com.testapi.ekart.model.LoginRequest;
import com.testapi.ekart.model.PasswordResetbyOtp;

import com.testapi.ekart.model.RegisterRequest;
import com.testapi.ekart.model.ResetPasswordRequest;
import com.testapi.ekart.model.VerifyOTPRequest;
import com.testapi.ekart.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;


	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.regiter(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(response,HttpStatus.OK,response.getMessage()));
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
		System.out.println("LOGIN REQUEST" + request.getEmail() + "," + request.getPassword());

		AuthResponse response = authService.login(request);
		System.out.println("LOGIN RESPONSE " + response);
		return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK,response.getMessage()));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse<AuthResponse>> forgotpassword(@Valid @RequestBody ForgetPasswordRequest request) {
		authService.forgetPassword(request);
		AuthResponse response = AuthResponse.builder().username(request.getEmail()).message(
				"Password reset token generated. Check your email for the token.")
				.role(null).token(authService.forgetPassword(request)).build();
		return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK,"Password reset token generated. Check your email for the token."));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<AuthResponse>> resetpassword(@Valid @RequestBody ResetPasswordRequest request) {
		if (authService.resetPassword(request)) {
			AuthResponse response = AuthResponse.builder()
					.message("Password has been reset successfully. You can now log in with your new password.")
					.build();
			return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK,"Password has been reset successfully. You can now log in with your new password."));
		}
		return ResponseEntity.ok(mapToResponse(null,HttpStatus.NOT_FOUND,""));
	}
	
	@PostMapping("/reset-password-by-otp")
	public ResponseEntity<ApiResponse<AuthResponse>> resetpasswordbyOTP(@Valid @RequestBody PasswordResetbyOtp request) {
		if (authService.resetPasswordbyOTP(request)) {
			AuthResponse response = AuthResponse.builder()
					.message("Password has been reset successfully. You can now log in with your new password.")
					.build();
			return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK,"Password has been reset successfully. You can now log in with your new password."));
		}
		return ResponseEntity.ok(mapToResponse(null,HttpStatus.NOT_FOUND,""));
	}
	
	@PostMapping("/send-otp")
	public ResponseEntity<ApiResponse<AuthResponse>> sendOTP(@Valid @RequestBody ForgetPasswordRequest request){
		if(authService.sendOtp(request)) {
			AuthResponse response = AuthResponse.builder()
					.message("OTP has been sent to your registered email successfully.")
					.build();
			return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK,"OTP has been sent to your registered email successfully."));
		}
		
		return ResponseEntity.ok(mapToResponse(null,HttpStatus.NOT_FOUND,""));
		
	}
	
	@PostMapping("/verify-otp")
	public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOTPRequest request){
		if(authService.verifyOtp(request)) {
			AuthResponse response = AuthResponse.builder()
					.message("OTP verified successfully. You can now set your new password.")
					.build();
			String mes = "OTP verified successfully. You can now set your new password."; 
			return ResponseEntity.ok(mapToResponse(response,HttpStatus.OK,mes));
		}
		
		return ResponseEntity.ok(mapToResponse(null,HttpStatus.NOT_FOUND,""));
		
	}

	public <T> ApiResponse mapToResponse(T response,HttpStatusCode code,String message) {
	
		return ApiResponse
				.builder()
				.message(!message.isEmpty() ? message : "Successfully Fetched!")
				.status(true)
				.statusCode(code.value())
				.errors(null)
				.data(response)
				.build();

	}

}
