
package com.school.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "students",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "student_code"),
                @UniqueConstraint(columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Student {

    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("id")
    @Column(
            name = "student_code",
            nullable = false,
            unique = true,
            length = 30
    )
    private String studentCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 20)
    private String gender;

    private LocalDate dob;

    @Column(length = 40)
    private String phone;

    @Column(length = 180)
    private String email;

    @Column(length = 300)
    private String address;

    // Keep the old column temporarily for compatibility.
    @Column(name = "class_name", nullable = false, length = 40)
    @JsonProperty("class")
    private String className;

    // New relationship using the database foreign key.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    @JsonIgnore
    private SchoolClass schoolClass;

    @Column(length = 100)
    private String teacher;

    @Column(nullable = false, length = 20)
    private String status = "Active";

    @Column(precision = 3, scale = 1)
    private BigDecimal gpa;

    @Column(length = 4)
    private String avatar;

    private LocalDate enrolled = LocalDate.now();

    @PrePersist
    @PreUpdate
    private void syncClassName() {
        if (schoolClass != null) {
            this.className = schoolClass.getName();
        }
    }
}
