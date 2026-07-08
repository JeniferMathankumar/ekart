package com.testapi.ekart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.testapi.ekart.entity.Role;
import com.testapi.ekart.entity.User;
import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	
	List<User> findByRole(Role role);

}
