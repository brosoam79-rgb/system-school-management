
package com.school.management.dto;

import java.time.LocalDate;
import java.util.List;

public record BulkAttendanceRequest(
        String className,
        LocalDate date,
        List<AttendanceItem> records
) {
    public record AttendanceItem(
            String studentId,
            String status,
            String note
    ) {}
}
