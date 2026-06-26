package com.example.ksep.services;

import com.example.ksep.dto.DealClosureRequestDto;
import com.example.ksep.dto.EoiRequestDto;
import com.example.ksep.dto.EoiResponseDto;
import com.example.ksep.dto.ProgrammeResponseDto;
import com.example.ksep.models.*;
import com.example.ksep.repository.CorporateProfileRepository;
import com.example.ksep.repository.DealClosureRepository;
import com.example.ksep.repository.ExpressionOfInterestRepository;
import com.example.ksep.repository.ProgrammeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchmakingService {

        private final ProgrammeRepository programmeRepository;
        private final ExpressionOfInterestRepository eoiRepository;
        private final CorporateProfileRepository corporateProfileRepository;
        private final DealClosureRepository dealClosureRepository;
        private final EmailService emailService;

        // 1. Browse the Pool with Filters
        @Transactional(readOnly = true)
        public List<ProgrammeResponseDto> browseProgrammes(String domain, String location, String type) {
                return programmeRepository.findAvailableProgrammes(domain, location, type).stream()
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
                                ))
                                .collect(Collectors.toList());
        }

        // FIXED: Now properly accepts both userId and progId from the controller
        @Transactional
        public EoiResponseDto expressInterest(Long userId, Long progId, EoiRequestDto request) {
                CorporateProfile corporate = corporateProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Corporate profile not found"));

                // Use the progId from the URL path instead of the payload to ensure integrity
                Programme programme = programmeRepository.findById(progId)
                                .orElseThrow(() -> new RuntimeException("Programme not found"));

                if (eoiRepository.existsByCorporateIdAndProgrammeId(corporate.getId(), programme.getId())) {
                        throw new RuntimeException("Interest already expressed for this programme");
                }

                ExpressionOfInterest eoi = ExpressionOfInterest.builder()
                                .corporate(corporate)
                                .programme(programme)
                                .status(EoiStatus.PENDING)
                                .build();

                ExpressionOfInterest saved = eoiRepository.save(eoi);

                // Notify the campus that a corporate expressed interest
                String campusEmail = programme.getCampus().getUser().getEmail();
                String campusName = programme.getCampus().getCampusName();
                emailService.sendEoiNotificationToCampus(
                                campusEmail, campusName,
                                corporate.getCompanyName(), programme.getTitle());

                return new EoiResponseDto(saved.getId(), corporate.getId(), corporate.getCompanyName(),
                                programme.getId(), programme.getTitle(), saved.getStatus().name());
        }

        @Transactional(readOnly = true)
        public List<EoiResponseDto> getCorporateInterests(Long userId) {
                CorporateProfile corporate = corporateProfileRepository.findByUserId(userId)
                                .orElseThrow(() -> new RuntimeException("Corporate profile not found"));

                return eoiRepository.findByCorporateId(corporate.getId()).stream()
                                .map(eoi -> new EoiResponseDto(
                                                eoi.getId(), eoi.getCorporate().getId(),
                                                eoi.getCorporate().getCompanyName(),
                                                eoi.getProgramme().getId(), eoi.getProgramme().getTitle(),
                                                eoi.getStatus().name()))
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<EoiResponseDto> getAllMatchedPairs() {
                // Fetch all expressions of interest for the global matching dashboard
                return eoiRepository.findAll().stream()
                                .map(eoi -> new EoiResponseDto(
                                                eoi.getId(), eoi.getCorporate().getId(),
                                                eoi.getCorporate().getCompanyName(),
                                                eoi.getProgramme().getId(), eoi.getProgramme().getTitle(),
                                                eoi.getStatus().name()))
                                .collect(Collectors.toList());
        }

        // 3. Close the Deal
        @Transactional
        public void closeDeal(DealClosureRequestDto request) {
                ExpressionOfInterest eoi = eoiRepository.findById(request.eoiId())
                                .orElseThrow(() -> new RuntimeException("EOI not found"));

                eoi.setStatus(EoiStatus.CLOSED);
                eoiRepository.save(eoi);

                DealClosure deal = DealClosure.builder()
                                .eoi(eoi)
                                .campusDeliverable(request.campusDeliverable())
                                .corporateDeliverable(request.corporateDeliverable())
                                .build();

                dealClosureRepository.save(deal);

                // Notify both parties that the deal is closed
                String campusEmail = eoi.getProgramme().getCampus().getUser().getEmail();
                String campusName = eoi.getProgramme().getCampus().getCampusName();
                String corporateEmail = eoi.getCorporate().getUser().getEmail();
                String companyName = eoi.getCorporate().getCompanyName();

                emailService.sendDealClosureNotification(
                                campusEmail, campusName,
                                corporateEmail, companyName,
                                eoi.getProgramme().getTitle());
        }

        @Transactional
        public void withdrawInterest(Long userId, Long progId) {
            CorporateProfile corporate = corporateProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Corporate profile not found"));

            ExpressionOfInterest eoi = eoiRepository
                    .findByCorporateIdAndProgrammeId(corporate.getId(), progId)
                    .orElseThrow(() -> new RuntimeException("No interest found for this programme"));

            if (eoi.getStatus() == EoiStatus.CLOSED) {
                throw new RuntimeException("Cannot withdraw a closed deal");
            }

            eoiRepository.delete(eoi);
        }
}
