package com.example.ksep.services;

import com.example.ksep.dto.CorporateProfileResponseDto;
import com.example.ksep.dto.DealClosureResponseDto;
import com.example.ksep.dto.ProgrammeResponseDto;
import com.example.ksep.repository.DealClosureRepository;
import com.example.ksep.repository.ExpressionOfInterestRepository;
import com.example.ksep.repository.ProgrammeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProgrammeRepository programmeRepository;
    private final DealClosureRepository dealClosureRepository;
    private final ExpressionOfInterestRepository eoiRepository;
    private final CorporateService corporateService;

    @Transactional(readOnly = true)
    public List<ProgrammeResponseDto> getAllProgrammes() {
        return programmeRepository.findAll().stream()
                .map(p -> new ProgrammeResponseDto(
                        p.getId(),
                        p.getCampus().getId(),
                        p.getCampus().getCampusName(),
                        p.getTitle(),
                        p.getType().name(),
                        p.getDomain(),
                        p.getSubDomain(),
                        p.getLocation(),
                        p.getScale(),
                        p.getStartDate(),
                        p.getEndDate(),
                        p.getParticipantsCount(),
                        p.getDescription(),
                        p.getFeeBased(),
                        p.getStatus().name()
                )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DealClosureResponseDto> getAllDeals() {
        return dealClosureRepository.findAll().stream()
                .map(d -> new DealClosureResponseDto(
                        d.getId(),
                        d.getEoi().getId(),
                        d.getEoi().getProgramme().getTitle(),
                        d.getEoi().getCorporate().getCompanyName(),
                        d.getCampusDeliverable(),
                        d.getCorporateDeliverable()
                )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CorporateProfileResponseDto> getAllCorporates() {
        return corporateService.getAllCorporates();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPlatformStats() {
        long totalProgrammes = programmeRepository.countActiveProgrammes();
        long dealsClosed = dealClosureRepository.count();
        long activeExpressions = eoiRepository.count();

        return Map.of(
                "totalProgrammes", totalProgrammes,
                "dealsClosed", dealsClosed,
                "activeExpressions", activeExpressions
        );
    }
}
