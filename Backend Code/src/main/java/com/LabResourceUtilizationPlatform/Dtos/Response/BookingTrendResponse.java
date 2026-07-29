package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingTrendResponse {

    private String bookingDate;

    private Long bookingCount;
}