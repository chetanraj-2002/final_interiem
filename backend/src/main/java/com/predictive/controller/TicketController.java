package com.predictive.controller;

import com.predictive.dto.OpenCountDto;
import com.predictive.entity.MaintenanceTicket;
import com.predictive.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceTicket>> getAllTickets() {
        return ResponseEntity.ok(maintenanceService.getAllTickets());
    }

    @GetMapping("/open-counts")
    public ResponseEntity<List<OpenCountDto>> getOpenCounts() {
        return ResponseEntity.ok(maintenanceService.getOpenTicketCounts());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaintenanceTicket> createTicket(
            @RequestBody Map<String, Object> body) {
        Long assetId = Long.valueOf(body.get("assetId").toString());
        String issueType = body.get("issueType").toString();
        MaintenanceTicket ticket = maintenanceService.createTicket(assetId, issueType);
        return ResponseEntity.ok(ticket);
    }
}
