package com.testapi.ekart.service;

import java.util.List;

import com.testapi.ekart.model.AuthResponse;
import com.testapi.ekart.model.ForgetPasswordRequest;
import com.testapi.ekart.model.LoginRequest;
import com.testapi.ekart.model.PasswordResetbyOtp;
import com.testapi.ekart.model.ProfileRequest;
import com.testapi.ekart.model.ProfileResponse;
import com.testapi.ekart.model.RegisterRequest;
import com.testapi.ekart.model.ResetPasswordRequest;
import com.testapi.ekart.model.UserResponse;
import com.testapi.ekart.model.VerifyOTPRequest;

public interface AuthService {
	AuthResponse regiter(RegisterRequest request);
	AuthResponse login(LoginRequest request);
	String forgetPassword(ForgetPasswordRequest request);
	boolean resetPassword(ResetPasswordRequest request);
	boolean resetPasswordbyOTP(PasswordResetbyOtp request);
	boolean sendOtp(ForgetPasswordRequest request);
	boolean verifyOtp(VerifyOTPRequest request); 
	ProfileResponse profileUpdate(ProfileRequest request);
	List<UserResponse> getAllUsers();
	UserResponse getUserById(Long id);
	boolean deleteUserById(Long id);
}
