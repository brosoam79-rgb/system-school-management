
package com.school.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "attendance_records",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"student_code", "attendance_date"}
        )
)
@Getter
@Setter
@NoArgsConstructor
public class AttendanceRecord {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 // Keep the existing student code for frontend compatibility.
 @Column(name = "student_code", nullable = false, length = 30)
 private String studentId;

 @Column(name = "student_name", nullable = false, length = 150)
 private String studentName;

 @Column(name = "class_name", nullable = false, length = 40)
 @JsonProperty("class")
 private String className;

 // New database relationship: attendance_records.student_id
 // references students.id.
 @ManyToOne(fetch = FetchType.LAZY)
 @JoinColumn(name = "student_id")
 @JsonIgnore
 private Student student;

 @Column(name = "attendance_date", nullable = false)
 private LocalDate date;

 @Column(nullable = false, length = 20)
 private String status = "Present";

 @Column(length = 300)
 private String note;
}
