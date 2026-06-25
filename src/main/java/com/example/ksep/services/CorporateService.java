package com.example.ksep.services;

import com.example.ksep.dto.CorporateProfileResponseDto;
import com.example.ksep.models.CorporateProfile;
import com.example.ksep.repository.CorporateProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CorporateService {

    private final CorporateProfileRepository corporateProfileRepository;

    @Transactional(readOnly = true)
    public List<CorporateProfileResponseDto> getAllCorporates() {
        return corporateProfileRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CorporateProfileResponseDto getCorporateByUserId(Long userId) {
        CorporateProfile profile = corporateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Corporate profile not found"));
        return mapToResponse(profile);
    }

    private CorporateProfileResponseDto mapToResponse(CorporateProfile p) {
        return new CorporateProfileResponseDto(
                p.getId(),
                p.getUser().getEmail(),
                p.getCompanyName(),
                p.getType().name()
        );
    }
}

