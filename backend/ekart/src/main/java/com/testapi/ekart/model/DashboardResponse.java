package com.testapi.ekart.model;

public record DashboardResponse(
        Long products,
        Long categories,
        Long banners
) {}