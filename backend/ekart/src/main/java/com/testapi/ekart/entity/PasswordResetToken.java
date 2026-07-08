package com.testapi.ekart.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Builder
@Entity
@Table(name="password_reset_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetToken {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false,unique = true)
	private String token;
	
	@Column(nullable = false)
	private LocalDateTime expiryDate;
	
	@OneToOne
	@JoinColumn(name="user_id",nullable = false)
	private User user;
	
	//To check the token is valid or not
	public boolean isValid() {
		return LocalDateTime.now().isBefore(expiryDate);
		// TODO Auto-generated method stub

	}

}
