
package com.school.management.repository;

import com.school.management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentCode(String code);

    boolean existsByEmailIgnoreCase(String email);

    List<Student> findAllByOrderByNameAsc();

    List<Student> findByClassNameIgnoreCaseOrderByNameAsc(
            String className
    );

    long countByStatusIgnoreCase(String status);
}
