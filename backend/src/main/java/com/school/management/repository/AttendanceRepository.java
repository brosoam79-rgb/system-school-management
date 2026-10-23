
package com.school.management.repository;

import com.school.management.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByDate(LocalDate date);

    List<AttendanceRecord> findByClassNameIgnoreCase(String className);

    List<AttendanceRecord> findByDateAndClassNameIgnoreCase(
            LocalDate date,
            String className
    );

    boolean existsByStudentIdAndDate(
            String studentId,
            LocalDate date
    );

    Optional<AttendanceRecord> findByStudentIdAndDate(
            String studentId,
            LocalDate date
    );
}
