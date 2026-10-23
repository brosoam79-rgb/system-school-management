
package com.school.management.controller;

import com.school.management.entity.Activity;
import com.school.management.entity.SchoolClass;
import com.school.management.entity.Student;
import com.school.management.repository.ActivityRepository;
import com.school.management.repository.SchoolClassRepository;
import com.school.management.repository.StudentRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository students;
    private final SchoolClassRepository schoolClasses;
    private final ActivityRepository activities;

    public StudentController(
            StudentRepository students,
            SchoolClassRepository schoolClasses,
            ActivityRepository activities) {
        this.students = students;
        this.schoolClasses = schoolClasses;
        this.activities = activities;
    }

    @GetMapping
    public List<Student> all(
            @RequestParam(required = false) String search,
            @RequestParam(name = "class", required = false) String className,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String gender) {

        return students.findAllByOrderByNameAsc()
                .stream()
                .filter(s -> blank(search)
                        || contains(s.getName(), search)
                        || contains(s.getStudentCode(), search)
                        || contains(s.getEmail(), search))
                .filter(s -> blank(className)
                        || eq(s.getClassName(), className))
                .filter(s -> blank(status)
                        || eq(s.getStatus(), status))
                .filter(s -> blank(gender)
                        || eq(s.getGender(), gender))
                .toList();
    }

    @GetMapping("/{code}")
    public Student one(@PathVariable String code) {
        return students.findByStudentCode(code)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Student not found: " + code));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Student> create(
            @Valid @RequestBody Student s) {

        if (blank(s.getName()) || blank(s.getClassName())) {
            throw new IllegalArgumentException(
                    "Student name and class are required");
        }

        if (!blank(s.getEmail())
                && students.existsByEmailIgnoreCase(s.getEmail())) {
            throw new IllegalArgumentException(
                    "A student with this email already exists");
        }

        // Find the existing class and set the relationship.
        SchoolClass selectedClass = resolveClass(s.getClassName());
        s.setSchoolClass(selectedClass);
        s.setClassName(selectedClass.getName());

        s.setId(null);
        s.setStudentCode(nextCode());
        s.setAvatar(initials(s.getName()));

        if (s.getEnrolled() == null) {
            s.setEnrolled(LocalDate.now());
        }

        if (blank(s.getStatus())) {
            s.setStatus("Active");
        }

        Student saved = students.save(s);

        activity(
                "add",
                "New student " + saved.getName()
                        + " enrolled in " + saved.getClassName(),
                "student");

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{code}")
    @Transactional
    public Student update(
            @PathVariable String code,
            @RequestBody Student input) {

        Student s = one(code);

        if (blank(input.getName())) {
            throw new IllegalArgumentException(
                    "Student name is required");
        }

        if (!blank(input.getEmail())
                && !input.getEmail().equalsIgnoreCase(s.getEmail())
                && students.existsByEmailIgnoreCase(input.getEmail())) {
            throw new IllegalArgumentException(
                    "A student with this email already exists");
        }

        s.setName(input.getName());
        s.setGender(input.getGender());
        s.setDob(input.getDob());
        s.setPhone(input.getPhone());
        s.setEmail(input.getEmail());
        s.setAddress(input.getAddress());

        // Change the class only when a class is supplied.
        if (!blank(input.getClassName())) {
            SchoolClass selectedClass =
                    resolveClass(input.getClassName());

            s.setSchoolClass(selectedClass);
            s.setClassName(selectedClass.getName());
        }

        s.setTeacher(input.getTeacher());

        if (!blank(input.getStatus())) {
            s.setStatus(input.getStatus());
        }

        s.setGpa(input.getGpa());
        s.setAvatar(initials(s.getName()));

        Student saved = students.save(s);

        activity(
                "edit",
                saved.getName() + " profile updated",
                "edit");

        return saved;
    }

    @DeleteMapping("/{code}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable String code) {
        Student s = one(code);

        students.delete(s);

        activity(
                "delete",
                s.getName() + " was removed",
                "student");

        return ResponseEntity.noContent().build();
    }

    private SchoolClass resolveClass(String className) {
        return schoolClasses.findAll()
                .stream()
                .filter(c -> c.getName() != null
                        && c.getName().trim()
                        .equalsIgnoreCase(className.trim()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Class not found: " + className));
    }

    private String nextCode() {
        long n = students.count() + 1;
        String code;

        do {
            code = String.format("STU-%03d", n++);
        } while (students.findByStudentCode(code).isPresent());

        return code;
    }

    private String initials(String name) {
        if (name == null || name.isBlank()) {
            return "";
        }

        String[] parts = name.trim().split("\\s+");

        if (parts.length == 1) {
            return parts[0].substring(0, 1)
                    .toUpperCase(Locale.ROOT);
        }

        return (parts[0].substring(0, 1)
                + parts[1].substring(0, 1))
                .toUpperCase(Locale.ROOT);
    }

    private void activity(
            String type,
            String message,
            String icon) {

        Activity a = new Activity();
        a.setType(type);
        a.setMessage(message);
        a.setIcon(icon);

        activities.save(a);
    }

    private boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private boolean contains(String a, String b) {
        return a != null
                && a.toLowerCase(Locale.ROOT)
                .contains(b.toLowerCase(Locale.ROOT));
    }

    private boolean eq(String a, String b) {
        return a != null && a.equalsIgnoreCase(b);
    }
}
