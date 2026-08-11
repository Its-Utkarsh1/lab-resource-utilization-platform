package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateEquipmentRequest;
import com.LabResourceUtilizationPlatform.Dtos.Request.UpdateEquipmentRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentDetailResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentResponse;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import com.LabResourceUtilizationPlatform.Entity.Lab;
import com.LabResourceUtilizationPlatform.Repository.BookingRepository;
import com.LabResourceUtilizationPlatform.Repository.EquipmentRepository;
import com.LabResourceUtilizationPlatform.Repository.LabRepository;
import com.LabResourceUtilizationPlatform.Service.EquipmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final LabRepository labRepository;
    private final ModelMapper modelMapper;

    private final BookingRepository bookingRepository;

    private static final Logger logger =
            LoggerFactory.getLogger(EquipmentServiceImpl.class);

    @Override
    public EquipmentResponse createEquipment(
            CreateEquipmentRequest request,
            MultipartFile image) {

        Lab lab = labRepository
                .findByLabCodeAndInstitution_Code(
                        request.getLabCode(),
                        request.getInstitutionCode())
                .orElseThrow(() ->
                        new RuntimeException("Lab not found."));

        if (equipmentRepository.existsByEquipmentCodeAndLab(
                request.getEquipmentCode(), lab)) {
            throw new RuntimeException("Equipment code already exists.");
        }

        if (equipmentRepository.existsByEquipmentNameAndLab(
                request.getEquipmentName(), lab)) {
            throw new RuntimeException("Equipment name already exists.");
        }

        String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            try {

                String uploadDir = "uploads/";
                Files.createDirectories(Paths.get(uploadDir));

                String fileName =
                        UUID.randomUUID() + "_" + image.getOriginalFilename();

                Path filePath = Paths.get(uploadDir, fileName);

                Files.copy(
                        image.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                imageUrl = "/uploads/" + fileName;

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image.", e);
            }
        }

        Equipment equipment = Equipment.builder()
                .equipmentName(request.getEquipmentName())
                .equipmentCode(request.getEquipmentCode())
                .manufacturer(request.getManufacturer())
                .model(request.getModel())
                .description(request.getDescription())
                .specifications(request.getSpecifications())
                .imageUrl(imageUrl)
                .hourlyRate(request.getHourlyRate())
                .quantity(request.getQuantity())
                .status(request.getStatus())
                .lab(lab)
                .active(true)
                .build();

        equipment.setServiceIntervalDays(request.getServiceIntervalDays());

        LocalDate lastServiceDate =
                request.getLastServiceDate() != null
                        ? request.getLastServiceDate()
                        : LocalDate.now();

        equipment.setLastServiceDate(lastServiceDate);

        equipment.setNextServiceDate(
                lastServiceDate.plusDays(
                        request.getServiceIntervalDays()
                )
        );

        Equipment savedEquipment = equipmentRepository.save(equipment);

        logger.info("Equipment created: {}", savedEquipment.getEquipmentCode());

        return mapToResponse(savedEquipment);
    }

    @Override
    @Transactional
    public Map<String, Long> getEquipmentStatusCounts(String institutionCode) {

        List<Equipment> equipments =
                equipmentRepository.findByLab_Institution_CodeAndActiveTrue(institutionCode);

        Map<String, Long> counts = new HashMap<>();

        counts.put(
                "AVAILABLE",
                equipments.stream()
                        .filter(e -> e.getStatus() == EquipmentStatus.AVAILABLE)
                        .count());

        counts.put(
                "IN_USE",
                equipments.stream()
                        .filter(e -> e.getStatus() == EquipmentStatus.IN_USE)
                        .count());

        counts.put(
                "MAINTENANCE",
                equipments.stream()
                        .filter(e -> e.getStatus() == EquipmentStatus.UNDER_MAINTENANCE)
                        .count());

        counts.put(
                "OUT_OF_SERVICE",
                equipments.stream()
                        .filter(e -> e.getStatus() == EquipmentStatus.OUT_OF_SERVICE)
                        .count());

        return counts;
    }

    //For Lab Manager Only
    @Override
    public EquipmentDetailResponse getEquipmentDetail(String equipmentCode, String labCode, String institutionCode) {
        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabCodeAndLab_Institution_CodeAndActiveTrue(
                        equipmentCode,
                        labCode,
                        institutionCode)
                .orElseThrow(() -> new RuntimeException("Equipment not found."));

        return mapToDetailResponse(equipment);
    }

    @Override
    @Transactional
    public void updateStatus(String equipmentCode,
                             EquipmentStatus status) {

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndActiveTrue(equipmentCode)
                .orElseThrow(() ->
                        new RuntimeException("Equipment not found."));

        equipment.setStatus(status);

        equipmentRepository.save(equipment);
    }

    @Override
//    @Cacheable(value = "equipment", key = "#institutionCode + ':' + #labCode + ':' + #equipmentCode")
    public EquipmentResponse getEquipmentByCode(String equipmentCode, String labCode, String institutionCode) {
        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabCodeAndLab_Institution_CodeAndActiveTrue(
                        equipmentCode,
                        labCode,
                        institutionCode)
                .orElseThrow(() -> new RuntimeException("Equipment not found."));

        return mapToResponse(equipment);
    }

    @Override
    public List<EquipmentResponse> getAllEquipment(String labCode, String institutionCode) {
        return equipmentRepository
                .findByLab_LabCodeAndLab_Institution_CodeAndActiveTrue(
                        labCode,
                        institutionCode)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<EquipmentResponse> getDepartmentEquipment(
            String institutionCode,
            String departmentName) {

        List<Equipment> equipments =
                equipmentRepository.findByLab_Department_NameAndLab_Department_Institution_CodeAndActiveTrue(
                        departmentName,
                        institutionCode);

        return equipments.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @CacheEvict(value = "equipment", allEntries = true)
    public EquipmentResponse updateEquipment(UpdateEquipmentRequest request) {

        Lab lab = labRepository
                .findByLabCodeAndInstitution_Code(
                        request.getLabCode(),
                        request.getInstitutionCode())
                .orElseThrow(() -> new RuntimeException("Lab not found."));

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab(
                        request.getEquipmentCode(),
                        lab)
                .orElseThrow(() -> new RuntimeException("Equipment not found."));

        if (request.getNewEquipmentCode() != null
                && !request.getNewEquipmentCode().isBlank()) {

            if (!equipment.getEquipmentCode().equals(request.getNewEquipmentCode())
                    && equipmentRepository.existsByEquipmentCodeAndLab(
                    request.getNewEquipmentCode(), lab)) {

                throw new RuntimeException("Equipment code already exists.");
            }

            equipment.setEquipmentCode(request.getNewEquipmentCode());
        }

        if (!equipment.getEquipmentName().equals(request.getEquipmentName())
                && equipmentRepository.existsByEquipmentNameAndLab(
                request.getEquipmentName(), lab)) {

            throw new RuntimeException("Equipment name already exists.");
        }

        equipment.setEquipmentName(request.getEquipmentName());
        equipment.setManufacturer(request.getManufacturer());
        equipment.setModel(request.getModel());
        equipment.setDescription(request.getDescription());
        equipment.setSpecifications(request.getSpecifications());
        equipment.setImageUrl(request.getImageUrl());
        equipment.setHourlyRate(request.getHourlyRate());
        equipment.setQuantity(request.getQuantity());
        equipment.setStatus(request.getStatus());
        equipment.setServiceIntervalDays(request.getServiceIntervalDays());

        LocalDate lastServiceDate =
                request.getLastServiceDate() != null
                        ? request.getLastServiceDate()
                        : equipment.getLastServiceDate();

        equipment.setLastServiceDate(lastServiceDate);

        equipment.setNextServiceDate(
                lastServiceDate.plusDays(
                        request.getServiceIntervalDays()
                )
        );

        Equipment updatedEquipment = equipmentRepository.save(equipment);
        logger.info("Equipment updated: {}", updatedEquipment.getEquipmentCode());
        return mapToResponse(updatedEquipment);
    }

    @Override
    @CacheEvict(value = "equipment", allEntries = true)
    public void deleteEquipment(String equipmentCode, String labCode, String institutionCode) {

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabCodeAndLab_Institution_CodeAndActiveTrue(
                        equipmentCode,
                        labCode,
                        institutionCode)
                .orElseThrow(() -> new RuntimeException("Equipment not found."));

        if (bookingRepository.existsByEquipmentIdAndStatusIn(
                equipment.getId(),
                List.of(
                        BookingStatus.PENDING,
                        BookingStatus.CONFIRMED
                ))) {

            throw new RuntimeException(
                    "Cannot delete equipment because it has active bookings."
            );
        }
        equipment.setActive(false);

        logger.info(
                "Before save -> id={}, active={}",
                equipment.getId(),
                equipment.getActive()
        );

        equipmentRepository.save(equipment);

        logger.info(
                "Equipment deactivated: {}",
                equipment.getEquipmentCode()
        );
    }

    private EquipmentResponse mapToResponse(Equipment equipment) {

        Integer bookedQuantity = bookingRepository.getBookedQuantity(
                equipment.getId(),
                List.of(BookingStatus.CONFIRMED)
        );

        if (bookedQuantity == null) {
            bookedQuantity = 0;
        }

        return EquipmentResponse.builder()
                .equipmentName(equipment.getEquipmentName())
                .equipmentCode(equipment.getEquipmentCode())
                .model(equipment.getModel())
                .description(equipment.getDescription())
                .hourlyRate(equipment.getHourlyRate())
                .specifications(equipment.getSpecifications())
                .imageUrl(equipment.getImageUrl())
                .labCode(equipment.getLab().getLabCode())
                .availableQuantity(
                        Math.max(0, equipment.getQuantity() - bookedQuantity)
                )
                .status(equipment.getStatus().name())
                .lab(equipment.getLab().getLabName())
                .department(equipment.getLab().getDepartment().getName())
                .institution(equipment.getLab().getInstitution().getName())
                .serviceIntervalDays(equipment.getServiceIntervalDays())
                .lastServiceDate(equipment.getLastServiceDate())
                .nextServiceDate(equipment.getNextServiceDate())
                .serviceDueInDays(
                        equipment.getNextServiceDate() == null
                                ? null
                                : ChronoUnit.DAYS.between(
                                LocalDate.now(),
                                equipment.getNextServiceDate()
                        )
                )
                .build();

    }

    private EquipmentDetailResponse mapToDetailResponse(Equipment equipment) {

        Integer bookedQuantity = bookingRepository.getBookedQuantity(
                equipment.getId(),
                List.of(BookingStatus.CONFIRMED)
        );

        if (bookedQuantity == null) {
            bookedQuantity = 0;
        }

        return EquipmentDetailResponse.builder()
                .equipmentName(equipment.getEquipmentName())
                .equipmentCode(equipment.getEquipmentCode())
                .manufacturer(equipment.getManufacturer())
                .model(equipment.getModel())
                .description(equipment.getDescription())
                .specifications(equipment.getSpecifications())
                .imageUrl(equipment.getImageUrl())
                .hourlyRate(equipment.getHourlyRate())
                .quantity(equipment.getQuantity())
                .availableQuantity(
                        Math.max(0, equipment.getQuantity() - bookedQuantity)
                )
                .status(equipment.getStatus().name())
                .lab(equipment.getLab().getLabName())
                .department(equipment.getLab().getDepartment().getName())
                .institution(equipment.getLab().getInstitution().getName())
                .serviceIntervalDays(equipment.getServiceIntervalDays())
                .lastServiceDate(equipment.getLastServiceDate())
                .nextServiceDate(equipment.getNextServiceDate())
                .serviceDueInDays(
                        equipment.getNextServiceDate() == null
                                ? null
                                : ChronoUnit.DAYS.between(
                                LocalDate.now(),
                                equipment.getNextServiceDate()
                        )
                )
                .build();
    }
}
