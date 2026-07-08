package com.testapi.ekart.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatusCode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import lombok.Setter;


@Data
@Getter
@Setter
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
	private boolean status;
	private int statusCode;
	private String message;
	private  T data;
	private List<String> errors;
	private LocalDateTime timestamp;
	
	public ApiResponse() {
		// TODO Auto-generated constructor stub
		this.timestamp  = LocalDateTime.now();
	}
	
}
