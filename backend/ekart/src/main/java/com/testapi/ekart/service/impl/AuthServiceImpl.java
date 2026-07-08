package com.testapi.ekart.service.impl;

import java.io.Console;
import java.text.Collator;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.testapi.ekart.entity.Category;
import com.testapi.ekart.entity.PasswordResetToken;
import com.testapi.ekart.entity.Role;
import com.testapi.ekart.entity.User;
import com.testapi.ekart.exception.BadRequestException;
import com.testapi.ekart.exception.ResourceNotFoundException;
import com.testapi.ekart.model.*;
import com.testapi.ekart.repository.PasswordResetTokenRepository;
import com.testapi.ekart.repository.UserRepository;
import com.testapi.ekart.security.JwtService;
import com.testapi.ekart.service.AuthService;
import com.testapi.ekart.service.EmailService;
import com.testapi.ekart.service.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepository;
	private final PasswordResetTokenRepository tokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final EmailService emailService;
	private final FileStorageService fileStorageService;
	String folderName = "profile";
	String imaString = "";
	
	@Value("${app.password-reset.token-expiry-minutes}")
	private int totalExpiryMinutes;


	@Override
	@Transactional
	public AuthResponse regiter(RegisterRequest request) {
		// TODO Auto-generated method stub
		System.out.println("REGISTER REQUEST"+request.getEmail()+","+request.getPassword());

		//Check email is unique
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email is already registered: "+request.getEmail());
		}
		//create new user if not exist
		User user = User.builder()
				.email(request.getEmail())
				.name(request.getName())
				.profileImage(null)
				.password(passwordEncoder.encode(request.getPassword()))
				.role(request.getRole() != null ? request.getRole() : Role.USER)
				.build();
		//save user 
		userRepository.save(user);
		log.info("New User registered {}:",user.getEmail());
		
		//create token using JWT
		String token  = jwtService.generateToken(user);
		Date tokenExpiry = jwtService.extractExpiration(token);
		log.info("EXTRACTED TIME",tokenExpiry);
		
		//return response with token
		return AuthResponse.builder()
				.token(token)
				.username(user.getName())
				.role(user.getRole().name())
				.email(user.getUsername())
				.profileimage(user.getProfileImage())
				.tokenExpiry(tokenExpiry)
				.message("User registerd Successfully")
				.build();
		
	}

	@Override
	@Transactional
	public AuthResponse login(LoginRequest request) {
		// TODO Auto-generated method stub
		System.out.println("AUTH LOGIN REQUEST"+request.getEmail()+","+request.getPassword());

		//Authenticate user using spring security (throws badcredentialsexception if invalid)

	        authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                request.getEmail(),
	                request.getPassword()
	            )
	        );

		
		//check user and generate token
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
		System.out.println("AUTH"+user);

		String token = jwtService.generateToken(user);
		Date tokenExpiry = jwtService.extractExpiration(token);
		
		return AuthResponse.builder()
				.username(user.getName())
				.role(user.getRole().name())
				.token(token)
				.email(user.getUsername())
				.profileimage(user.getProfileImage())
				.tokenExpiry(tokenExpiry)
				.message("User loggedin successfully")
				.build();
	}

	@Override
	@Transactional
	public String forgetPassword(ForgetPasswordRequest request) {
		// TODO Auto-generated method stub
		//check user is exist 
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(()-> new ResourceNotFoundException("User","email",request.getEmail()));
		
		//delete any existing reset token for user
		tokenRepository.deleteByUser(user);
		
		System.out.println(tokenRepository.findByUser(user));
		//generate new unique reset token
		String tokenValue = UUID.randomUUID().toString();
		
		PasswordResetToken resetToken = PasswordResetToken.builder()
				.token(tokenValue)
				.user(user)
				.expiryDate(LocalDateTime.now().plusMinutes(totalExpiryMinutes))
				.build();
				
		tokenRepository.save(resetToken);
		// In a real application, you would send this token via email.
        // For now, we log it for testing purposes.
		log.info("Password reset token for {}: {}",user.getEmail(), tokenValue);
        // TODO: Integrate email service to send reset link:
         emailService.sendPasswordResetEmail(user.getEmail(), tokenValue);
		return tokenValue;
	}

	@Override
	@Transactional
	public boolean resetPassword(ResetPasswordRequest request) {
		// TODO Auto-generated method stub
		
		//Find the reset token
		PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
				.orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
		
		//Check validation for token if expired or not
		if(!resetToken.isValid()) {
			tokenRepository.delete(resetToken);
			throw new BadRequestException("Reset token has expired. Please take a new one. ");
		}
		
		//Upadte user's password with BCrypt hash
		User user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
		
		//Delete used token
		tokenRepository.delete(resetToken);
		log.info("Password reset successfull for user : {}", user.getEmail());
		return true;
	}
	
	@Override
	@Transactional
	public boolean resetPasswordbyOTP(PasswordResetbyOtp request) {
		// TODO Auto-generated method stub
		
		//Find user by email
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(()-> new ResourceNotFoundException("User","email",request.getEmail()));
		
		//Upadte user's password with BCrypt hash
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
		
		log.info("Password reset successfull for user : {}", user.getEmail());
		return true;
	}
	
	

	@Override
	public boolean sendOtp(ForgetPasswordRequest req) {

		User user = userRepository.findByEmail(req.getEmail())
				.orElseThrow(()-> new ResourceNotFoundException("User","email",req.getEmail()));

        String otp =
                String.valueOf(
                        (int)((Math.random() * 900000) + 100000));

        user.setOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtpMail(req.getEmail(), otp);
        String success = "OTP sent successfully";

        return true;
    }

	@Override
	public boolean verifyOtp(VerifyOTPRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
				.orElseThrow(()-> new ResourceNotFoundException("User","email",req.getEmail()));

        if (!req.getOtp().equals(user.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        if (LocalDateTime.now()
                .isAfter(user.getOtpExpiry())) {

            throw new BadRequestException("OTP Expired");
        }
        
        user.setOtp("");
       
        userRepository.save(user);

        return true;
    }

	@Override
	public ProfileResponse profileUpdate(ProfileRequest request) {
		// TODO Auto-generated method stub
		
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(()-> new ResourceNotFoundException("User","email",request.getEmail()));
		
		if (request.getImageUrl() != null) {
			try {
				imaString = fileStorageService.uploadImage(request.getImageUrl(), folderName);
				user.setProfileImage("/uploads/" + folderName + "/"  + imaString);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		user.setName(request.getName());
		userRepository.save(user);
		
		
		return  ProfileResponse.builder()
				.name(user.getName())
				.imageUrl(user.getProfileImage())
				.build();
	}

	@Override
	public List<UserResponse> getAllUsers() {
		// TODO Auto-generated method stub
	
		return userRepository
				.findByRole(Role.USER)
				.stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public UserResponse getUserById(Long id) {
		// TODO Auto-generated method stub
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User","id",id));
		
		
		return mapToResponse(user);
	}

	@Override
	public boolean deleteUserById(Long id) {
		// TODO Auto-generated method stub
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User","id",id));
		userRepository.deleteById(id);
		return false;
	}
	
	
	private UserResponse mapToResponse(User user) {
		// TODO Auto-generated method stub
		return UserResponse.builder()
				.id(user.getId())
				.username(user.getUsername())
				.email(user.getEmail())
				.role(user.getRole().toString())
				.profileimage(user.getProfileImage())
				.isActive(user.isActive())
				.build();
	}

	

}
