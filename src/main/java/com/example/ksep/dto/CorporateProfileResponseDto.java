package com.example.ksep.dto;

public record CorporateProfileResponseDto(
        Long id,
        String email,
        String companyName,
        String type
) {}
