package com.predictive.controller;

import com.predictive.dto.ThresholdDto;
import com.predictive.entity.Threshold;
import com.predictive.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thresholds")
public class ThresholdController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping("/{assetId}")
    public ResponseEntity<Threshold> getThresholdByAssetId(@PathVariable Long assetId) {
        return maintenanceService.getThresholdByAssetId(assetId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Threshold> createOrUpdateThreshold(
            @RequestBody ThresholdDto dto) {
        Threshold saved = maintenanceService.saveOrUpdateThreshold(dto);
        return ResponseEntity.ok(saved);
    }
}
