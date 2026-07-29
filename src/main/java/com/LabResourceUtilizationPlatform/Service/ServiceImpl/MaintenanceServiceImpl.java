package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateMaintenanceRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.MaintenanceResponse;
import com.LabResourceUtilizationPlatform.Entity.Enum.*;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import com.LabResourceUtilizationPlatform.Entity.Maintenance;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.EquipmentRepository;
import com.LabResourceUtilizationPlatform.Repository.MaintenanceRepository;
import com.LabResourceUtilizationPlatform.Repository.UserRepository;
import com.LabResourceUtilizationPlatform.Service.MaintenanceService;
import com.LabResourceUtilizationPlatform.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public MaintenanceResponse createMaintenance(CreateMaintenanceRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User manager = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Manager not found."));

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabManager_Id(
                        request.getEquipmentCode(),
                        manager.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException("This equipment does not belong to your lab."));

        User technician = userRepository
                .findByEmail(request.getTechnicianEmail())
                .orElseThrow(() ->
                        new RuntimeException("Technician not found."));

        if (!technician.getDepartment().getId()
                .equals(manager.getDepartment().getId())) {

            throw new RuntimeException(
                    "Technician must belong to your department.");
        }

        if (technician.getRole().getRoleName() != RoleName.LAB_TECHNICIAN) {
            throw new RuntimeException(
                    "Selected user is not a Lab Technician.");
        }

        Maintenance maintenance = Maintenance.builder()
                .equipment(equipment)
                .technician(technician)
                .maintenanceType(
                        MaintenanceType.valueOf(request.getMaintenanceType()))
                .scheduledDate(request.getScheduledDate())
                .description(request.getDescription())
                .status(MaintenanceStatus.SCHEDULED)
                .build();

        maintenance = maintenanceRepository.save(maintenance);

        notificationService.notifyUser(
                technician,
                "Maintenance Assigned",
                "You have been assigned maintenance for equipment: "
                        + equipment.getEquipmentName(),
                NotificationType.MAINTENANCE
        );

        notificationService.notifyUser(
                manager,
                "Maintenance Scheduled",
                "Maintenance has been scheduled for equipment: "
                        + equipment.getEquipmentName(),
                NotificationType.MAINTENANCE
        );

        equipment.setStatus(EquipmentStatus.UNDER_MAINTENANCE);
        equipmentRepository.save(equipment);

        return mapToResponse(maintenance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getAllMaintenance() {

        return maintenanceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceResponse getMaintenance(Long id) {

        Maintenance maintenance = maintenanceRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Maintenance not found."));

        return mapToResponse(maintenance);
    }

    @Override
    public MaintenanceResponse updateMaintenance(
            Long id,
            CreateMaintenanceRequest request) {

        Maintenance maintenance = maintenanceRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Maintenance not found."));

        Equipment equipment = equipmentRepository
                .findByEquipmentCode(request.getEquipmentCode())
                .orElseThrow(() ->
                        new RuntimeException("Equipment not found."));

        User technician = userRepository
                .findByEmail(request.getTechnicianEmail())
                .orElseThrow(() ->
                        new RuntimeException("Technician not found."));

        maintenance.setEquipment(equipment);
        maintenance.setTechnician(technician);
        maintenance.setMaintenanceType(
                MaintenanceType.valueOf(request.getMaintenanceType()));
        maintenance.setScheduledDate(request.getScheduledDate());
        maintenance.setDescription(request.getDescription());

        maintenance = maintenanceRepository.save(maintenance);

        notificationService.notifyUser(
                technician,
                "Maintenance Updated",
                "Your maintenance assignment has been updated for equipment: "
                        + equipment.getEquipmentName(),
                NotificationType.MAINTENANCE
        );

        return mapToResponse(maintenance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getMyMaintenance() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return maintenanceRepository
                .findByTechnician_Email(authentication.getName())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public String startMaintenance(Long id) {

        Maintenance maintenance = maintenanceRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Maintenance not found."));

        maintenance.setStatus(MaintenanceStatus.IN_PROGRESS);

        maintenanceRepository.save(maintenance);

        notificationService.notifyUser(
                maintenance.getTechnician(),
                "Maintenance Started",
                "Maintenance has started for equipment: "
                        + maintenance.getEquipment().getEquipmentName(),
                NotificationType.MAINTENANCE
        );

        return "Maintenance started successfully.";
    }

    @Override
    public String completeMaintenance(Long id) {

        Maintenance maintenance = maintenanceRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Maintenance not found."));

        maintenance.setStatus(MaintenanceStatus.COMPLETED);

        Equipment equipment = maintenance.getEquipment();
        equipment.setStatus(EquipmentStatus.AVAILABLE);

        equipmentRepository.save(equipment);
        maintenanceRepository.save(maintenance);

        notificationService.notifyUser(
                maintenance.getTechnician(),
                "Maintenance Completed",
                "Maintenance completed successfully for equipment: "
                        + maintenance.getEquipment().getEquipmentName(),
                NotificationType.MAINTENANCE
        );

        notificationService.notifyUser(
                maintenance.getEquipment().getLab().getLabManager(),
                "Equipment Available",
                "Maintenance has been completed. Equipment "
                        + maintenance.getEquipment().getEquipmentName()
                        + " is now available.",
                NotificationType.MAINTENANCE
        );

        return "Maintenance completed successfully.";
    }

    private MaintenanceResponse mapToResponse(Maintenance maintenance) {

        return MaintenanceResponse.builder()
                .id(maintenance.getId())
                .equipmentCode(maintenance.getEquipment().getEquipmentCode())
                .equipmentName(maintenance.getEquipment().getEquipmentName())
                .maintenanceType(maintenance.getMaintenanceType().name())
                .scheduledDate(maintenance.getScheduledDate())
                .technicianName(maintenance.getTechnician().getFullName())
                .description(maintenance.getDescription())
                .status(maintenance.getStatus().name())
                .build();
    }
}