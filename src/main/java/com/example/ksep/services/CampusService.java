package com.example.ksep.services;

import com.example.ksep.dto.EoiResponseDto;
import com.example.ksep.dto.ProgrammeRequestDto;
import com.example.ksep.dto.ProgrammeResponseDto;
import com.example.ksep.models.CampusProfile;
import com.example.ksep.models.Programme;
import com.example.ksep.models.ProgrammeStatus;
import com.example.ksep.models.ProgrammeType;
import com.example.ksep.repository.CampusProfileRepository;
import com.example.ksep.repository.ExpressionOfInterestRepository;
import com.example.ksep.repository.ProgrammeRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampusService {

        private final ProgrammeRepository programmeRepository;
        private final CampusProfileRepository campusProfileRepository;
        private final ExpressionOfInterestRepository eoiRepository;

        @Transactional
        public ProgrammeResponseDto createProgramme(Long userId, ProgrammeRequestDto request) {
                CampusProfile campus = campusProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Campus profile not found"));

                Programme programme = Programme.builder()
                                .campus(campus)
                                .title(request.title())
                                .type(ProgrammeType.valueOf(request.type()))
                                .domain(request.domain())
                                .subDomain(request.subDomain())
                                .location(request.location())
                                .scale(request.scale())
                                .startDate(request.startDate())
                                .endDate(request.endDate())
                                .participantsCount(request.participantsCount())
                                .description(request.description())
                                .feeBased(request.feeBased())
                                .status(ProgrammeStatus.ACTIVE)
                                .build();

                Programme saved = programmeRepository.save(programme);
                return mapToProgrammeResponse(saved);
        }

        @Transactional
        public ProgrammeResponseDto updateProgramme(Long userId, Long programmeId, ProgrammeRequestDto request) {
                CampusProfile campus = campusProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Campus profile not found"));

                Programme programme = programmeRepository.findById(programmeId)
                                .orElseThrow(() -> new RuntimeException("Programme not found"));

                // Security check: Ensure the campus actually owns this programme
                if (!programme.getCampus().getId().equals(campus.getId())) {
                        throw new RuntimeException("Unauthorized to update this programme");
                }

                // Update fields
                programme.setTitle(request.title());
                programme.setType(ProgrammeType.valueOf(request.type()));
                programme.setDomain(request.domain());
                programme.setSubDomain(request.subDomain());
                programme.setLocation(request.location());
                programme.setScale(request.scale());
                programme.setStartDate(request.startDate());
                programme.setEndDate(request.endDate());
                programme.setParticipantsCount(request.participantsCount());
                programme.setDescription(request.description());
                programme.setFeeBased(request.feeBased());

                Programme updated = programmeRepository.save(programme);
                return mapToProgrammeResponse(updated);
        }

        @Transactional
        public ProgrammeResponseDto updateProgrammeStatus(Long userId, Long programmeId, String status) {
                CampusProfile campus = campusProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Campus profile not found"));

                Programme programme = programmeRepository.findById(programmeId)
                                .orElseThrow(() -> new RuntimeException("Programme not found"));

                if (!programme.getCampus().getId().equals(campus.getId())) {
                        throw new RuntimeException("Unauthorized to update this programme");
                }

                try {
                        programme.setStatus(ProgrammeStatus.valueOf(status.toUpperCase()));
                } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid status value: " + status +
                                        ". Valid values are: ACTIVE, CLOSED, CANCELLED");
                }

                Programme updated = programmeRepository.save(programme);
                return mapToProgrammeResponse(updated);
        }

        @Transactional(readOnly = true)
        public List<EoiResponseDto> getInterestsForProgramme(Long userId, Long programmeId) {
                CampusProfile campus = campusProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Campus profile not found"));

                Programme programme = programmeRepository.findById(programmeId)
                                .orElseThrow(() -> new RuntimeException("Programme not found"));

                if (!programme.getCampus().getId().equals(campus.getId())) {
                        throw new RuntimeException("Unauthorized to view interests for this programme");
                }

                return eoiRepository.findByProgrammeId(programmeId).stream()
                                .map(eoi -> new EoiResponseDto(
                                                eoi.getId(), eoi.getCorporate().getId(),
                                                eoi.getCorporate().getCompanyName(),
                                                eoi.getProgramme().getId(), eoi.getProgramme().getTitle(),
                                                eoi.getStatus().name()))
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<ProgrammeResponseDto> getCampusProgrammes(Long userId) {
                CampusProfile campus = campusProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Campus profile not found"));

                return programmeRepository.findByCampusId(campus.getId()).stream()
                                .map(this::mapToProgrammeResponse)
                                .collect(Collectors.toList());
        }

        private ProgrammeResponseDto mapToProgrammeResponse(Programme p) {
                return new ProgrammeResponseDto(
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
                );
        }
}
