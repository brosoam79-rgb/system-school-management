package com.school.management.repository;

import com.school.management.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolClassRepository
        extends JpaRepository<SchoolClass, Long> {
    Optional<SchoolClass> findByNameIgnoreCase(String name);
}
