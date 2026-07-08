package com.testapi.ekart.security;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	@Value("${jwt.secret}")
	private String secretKey;
	
	@Value("${jwt.expiration}")
	private long jwtExpiration;
	
	
	public String extractUsername(String token) {
		return extractClaim(token,Claims::getSubject);	
	}
	
	private <T> T extractClaim(String token, Function<Claims,T> claimsResolver) {
		// TODO Auto-generated method stub
		final Claims claims = extractAllClaims(token);
		
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		// TODO Auto-generated method stub
		
		return Jwts.parserBuilder()
				.setSigningKey(getSignInKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
			
	}
	
	public String generateToken(UserDetails userDetails) {
		return generateToken(new HashMap<>(),userDetails);
	}
	
	private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
		// TODO Auto-generated method stub
		System.out.println("Current TIME "+ new Date(System.currentTimeMillis()));
		System.out.println("EXPIRY JWT "+ jwtExpiration);
		System.out.println("EXPIRY TIME "+ new Date(System.currentTimeMillis()+jwtExpiration));
		
		return Jwts.builder()
				.setClaims(extraClaims)
				.setSubject(userDetails.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis()+jwtExpiration))
				.signWith(getSignInKey(),SignatureAlgorithm.HS256)
				.compact();
	}
	
	public boolean isTokenValid(String token,UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
		
	}
	public boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}
	
	public Date extractExpiration(String token) {
		// TODO Auto-generated method stub
		return extractClaim(token, Claims::getExpiration);
	}

	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(
				Base64
				.getEncoder()
				.encodeToString(secretKey.getBytes()));
		return Keys.hmacShaKeyFor(keyBytes);
		
	}

	
}
