package com.testapi.ekart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.testapi.ekart.entity.Slider_Images;

@Repository
public interface BannerRepository extends JpaRepository<Slider_Images, Long>{

}
