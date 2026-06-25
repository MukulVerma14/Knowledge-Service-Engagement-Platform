package com.example.ksep.controllers;

import com.example.ksep.dto.EoiResponseDto;
import com.example.ksep.dto.ProgrammeRequestDto;
import com.example.ksep.dto.ProgrammeResponseDto;
import com.example.ksep.services.CampusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/campus")
@RequiredArgsConstructor
public class CampusController {

    private final CampusService campusService;

    @PostMapping("/programmes")
    public ResponseEntity<ProgrammeResponseDto> createProgramme(Principal principal, @RequestBody ProgrammeRequestDto request) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(campusService.createProgramme(userId, request));
    }

    @GetMapping("/programmes")
    public ResponseEntity<List<ProgrammeResponseDto>> getOwnProgrammes(Principal principal) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(campusService.getCampusProgrammes(userId));
    }

    @PutMapping("/programmes/{id}")
    public ResponseEntity<ProgrammeResponseDto> updateProgramme(
            Principal principal,
            @PathVariable Long id,
            @RequestBody ProgrammeRequestDto request) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(campusService.updateProgramme(userId, id, request));
    }

    @PatchMapping("/programmes/{id}/status")
    public ResponseEntity<ProgrammeResponseDto> updateProgrammeStatus(
            Principal principal,
            @PathVariable Long id,
            @RequestParam String status) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(campusService.updateProgrammeStatus(userId, id, status));
    }

    @GetMapping("/interests/{progId}")
    public ResponseEntity<List<EoiResponseDto>> getInterestsForProgramme(Principal principal, @PathVariable Long progId) {
        Long userId = extractUserId(principal);
        return ResponseEntity.ok(campusService.getInterestsForProgramme(userId, progId));
    }

    // Helper method to extract ID from JWT context
    private Long extractUserId(Principal principal) {
        return Long.parseLong(principal.getName());
    }
}
