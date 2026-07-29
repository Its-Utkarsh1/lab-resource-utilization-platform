# API Mapping - Frontend to Backend

## ✅ Already Implemented in Backend

### AuthController (`/api/auth`)
| Method | Endpoint | Frontend Service | Status |
|--------|----------|-----------------|--------|
| POST | `/api/auth/login` | `authService.login()` | ✅ |
| POST | `/api/auth/verify-email` | `authService.verifyEmail()` | ✅ |
| POST | `/api/auth/resend-otp` | `authService.resendOtp()` | ✅ |
| POST | `/api/auth/forgot-password` | `authService.forgotPassword()` | ✅ |
| POST | `/api/auth/reset-password` | `authService.resetPassword()` | ✅ |
| POST | `/api/auth/refresh-token` | `authService.refreshToken()` | ✅ |

### UserController (`/api/users`)
| Method | Endpoint | Frontend Service | Status |
|--------|----------|-----------------|--------|
| POST | `/api/users` | `userService.create()` | ✅ |
| GET | `/api/users/{email}` | `userService.getByEmail()` | ✅ |
| GET | `/api/users/institutionCode/{institutionCode}` | `userService.getByInstitution()` | ✅ |
| PUT | `/api/users` | `userService.update()` | ✅ |
| DELETE | `/api/users/{email}` | `userService.delete()` | ✅ |

### InstitutionController (`/api/institutions`)
| Method | Endpoint | Frontend Service | Status |
|--------|----------|-----------------|--------|
| POST | `/api/institutions` | `institutionService.create()` | ✅ |
| GET | `/api/institutions/{instituteCode}` | `institutionService.getByCode()` | ✅ |
| GET | `/api/institutions` | `institutionService.getAll()` | ✅ |
| PUT | `/api/institutions` | `institutionService.update()` | ✅ |
| DELETE | `/api/institutions/{instituteCode}` | `institutionService.delete()` | ✅ |

### DepartmentController (`/api/departments`)
| Method | Endpoint | Frontend Service | Status |
|--------|----------|-----------------|--------|
| POST | `/api/departments` | `departmentService.create()` | ✅ |
| POST | `/api/departments/search` | `departmentService.getByName()` | ✅ |
| GET | `/api/departments/{institutionCode}` | `departmentService.getByInstitution()` | ✅ |
| PUT | `/api/departments/{newName}` | `departmentService.update()` | ✅ |
| DELETE | `/api/departments` | `departmentService.delete()` | ✅ |

### LabController (`/api/labs`)
| Method | Endpoint | Frontend Service | Status |
|--------|----------|-----------------|--------|
| POST | `/api/labs` | `labService.create()` | ✅ |
| GET | `/api/labs/{institutionCode}/{labCode}` | `labService.getByCode()` | ✅ |
| GET | `/api/labs/{institutionCode}` | `labService.getByInstitution()` | ✅ |
| PUT | `/api/labs` | `labService.update()` | ✅ |
| DELETE | `/api/labs/{institutionCode}/{labCode}` | `labService.delete()` | ✅ |

### EquipmentController (`/api/equipment`)
| Method | Endpoint | Frontend Service | Status |
|--------|----------|-----------------|--------|
| POST | `/api/equipment` | `equipmentService.create()` | ✅ |
| GET | `/api/equipment/{institutionCode}/{labCode}/{equipmentCode}` | `equipmentService.getByCode()` | ✅ |
| GET | `/api/equipment/{institutionCode}/{labCode}` | `equipmentService.getByLab()` | ✅ |
| PUT | `/api/equipment` | `equipmentService.update()` | ✅ |
| DELETE | `/api/equipment/{institutionCode}/{labCode}/{equipmentCode}` | `equipmentService.delete()` | ✅ |

## ❌ MISSING - You Need to Create These

### AuthController - Add These:
```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authService.register(request));
}

@GetMapping("/me")
public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
    return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
}
```

### BookingController - Create This:
```java
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody CreateBookingRequest request)

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(@RequestParam Map<String, String> params)

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings()

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id)

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable Long id, @RequestBody UpdateBookingRequest request)

    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(@PathVariable Long id)

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id)

    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarEvent>> getCalendar(@RequestParam Map<String, String> params)
}
```

### MaintenanceController - Create This:
```java
@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {
    @PostMapping
    public ResponseEntity<MaintenanceResponse> createMaintenance(@RequestBody CreateMaintenanceRequest request)

    @GetMapping
    public ResponseEntity<List<MaintenanceResponse>> getAllMaintenance(@RequestParam Map<String, String> params)

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> getMaintenanceById(@PathVariable Long id)

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> updateMaintenance(@PathVariable Long id, @RequestBody UpdateMaintenanceRequest request)

    @PutMapping("/{id}/complete")
    public ResponseEntity<MaintenanceResponse> completeMaintenance(@PathVariable Long id)

    @GetMapping("/upcoming")
    public ResponseEntity<List<MaintenanceResponse>> getUpcomingMaintenance()
}
```

### AnalyticsController - Create This:
```java
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats()

    @GetMapping("/utilization")
    public ResponseEntity<UtilizationResponse> getUtilization(@RequestParam Map<String, String> params)

    @GetMapping("/equipment-usage")
    public ResponseEntity<List<EquipmentUsageResponse>> getEquipmentUsage(@RequestParam Map<String, String> params)

    @GetMapping("/department-stats")
    public ResponseEntity<List<DepartmentStatsResponse>> getDepartmentStats()

    @GetMapping("/reports")
    public ResponseEntity<ReportsResponse> getReports(@RequestParam Map<String, String> params)

    @GetMapping("/export/{type}")
    public ResponseEntity<Resource> exportReport(@PathVariable String type, @RequestParam String format)
}
```

### NotificationController - Create This:
```java
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications()

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications()

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id)

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead()

    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreferencesResponse> getPreferences()

    @PutMapping("/preferences")
    public ResponseEntity<NotificationPreferencesResponse> updatePreferences(@RequestBody NotificationPreferencesRequest request)
}
```

### SharingController - Create This:
```java
@RestController
@RequestMapping("/api/sharing")
public class SharingController {
    @PostMapping("/requests")
    public ResponseEntity<SharingRequestResponse> createRequest(@RequestBody CreateSharingRequest request)

    @GetMapping("/requests")
    public ResponseEntity<List<SharingRequestResponse>> getRequests(@RequestParam Map<String, String> params)

    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<SharingRequestResponse> approveRequest(@PathVariable Long id)

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<SharingRequestResponse> rejectRequest(@PathVariable Long id)
}
```
