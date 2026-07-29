package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyBookingResponse {

    private String month;

    private Long totalBookings;
}