
package com.school.management.controller;

import com.school.management.dto.BulkAttendanceRequest;
import com.school.management.entity.AttendanceRecord;
import com.school.management.entity.Student;
import com.school.management.repository.AttendanceRepository;
import com.school.management.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5175",
        "http://localhost:3000"
})
public class AttendanceController {

 private final AttendanceRepository attendanceRepository;
 private final StudentRepository studentRepository;

 // GET /api/attendance
 // GET /api/attendance?date=2026-10-23
 // GET /api/attendance?className=Class%20A
 // GET /api/attendance?className=Class%20A&date=2026-10-23
 @GetMapping
 public List<AttendanceRecord> getAllAttendance(
         @RequestParam(required = false) String className,
         @RequestParam(required = false) LocalDate date) {

  if (className != null && !className.isBlank()
          && date != null) {
   return attendanceRepository
           .findByDateAndClassNameIgnoreCase(
                   date, className.trim());
  }

  if (date != null) {
   return attendanceRepository.findByDate(date);
  }

  if (className != null && !className.isBlank()) {
   return attendanceRepository
           .findByClassNameIgnoreCase(className.trim());
  }

  return attendanceRepository.findAll();
 }

 // GET /api/attendance/class?className=Class%20A
 @GetMapping("/class")
 public List<Student> getStudentsByClass(
         @RequestParam String className) {

  if (className == null || className.isBlank()) {
   throw new ResponseStatusException(
           HttpStatus.BAD_REQUEST,
           "Class name is required");
  }

  return studentRepository
          .findByClassNameIgnoreCaseOrderByNameAsc(
                  className.trim());
 }

 // GET /api/attendance/{id}
 @GetMapping("/{id}")
 public AttendanceRecord getAttendanceById(
         @PathVariable Long id) {

  return attendanceRepository.findById(id)
          .orElseThrow(() -> new ResponseStatusException(
                  HttpStatus.NOT_FOUND,
                  "Attendance record not found"));
 }

 // POST /api/attendance
 // Create attendance for one student
 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 @Transactional
 public AttendanceRecord createAttendance(
         @RequestBody AttendanceRecord request) {

  if (request.getStudentId() == null
          || request.getStudentId().isBlank()) {
   throw new ResponseStatusException(
           HttpStatus.BAD_REQUEST,
           "Student code is required");
  }

  LocalDate attendanceDate = request.getDate() != null
          ? request.getDate()
          : LocalDate.now();

  String studentCode = request.getStudentId().trim();

  Student student = studentRepository
          .findByStudentCode(studentCode)
          .orElseThrow(() -> new ResponseStatusException(
                  HttpStatus.NOT_FOUND,
                  "Student not found: " + studentCode));

  if (attendanceRepository.existsByStudentIdAndDate(
          student.getStudentCode(), attendanceDate)) {
   throw new ResponseStatusException(
           HttpStatus.CONFLICT,
           "Attendance already exists for this student and date");
  }

  String status = normalizeStatus(request.getStatus());

  AttendanceRecord record = new AttendanceRecord();
  record.setStudent(student);
  record.setStudentId(student.getStudentCode());
  record.setStudentName(student.getName());
  record.setClassName(student.getClassName());
  record.setDate(attendanceDate);
  record.setStatus(status);
  record.setNote(request.getNote());

  return attendanceRepository.save(record);
 }

 // POST /api/attendance/bulk
 // Submit attendance for multiple students in one request
 @PostMapping("/bulk")
 @ResponseStatus(HttpStatus.CREATED)
 @Transactional
 public List<AttendanceRecord> saveBulkAttendance(
         @RequestBody BulkAttendanceRequest request) {

  if (request == null
          || request.className() == null
          || request.className().isBlank()) {
   throw new ResponseStatusException(
           HttpStatus.BAD_REQUEST,
           "Class name is required");
  }

  if (request.date() == null) {
   throw new ResponseStatusException(
           HttpStatus.BAD_REQUEST,
           "Attendance date is required");
  }

  if (request.records() == null
          || request.records().isEmpty()) {
   throw new ResponseStatusException(
           HttpStatus.BAD_REQUEST,
           "Attendance records are required");
  }

  String className = request.className().trim();
  LocalDate date = request.date();

  Set<String> submittedCodes = new HashSet<>();
  List<AttendanceRecord> recordsToSave = new ArrayList<>();

  for (BulkAttendanceRequest.AttendanceItem item
          : request.records()) {

   if (item == null
           || item.studentId() == null
           || item.studentId().isBlank()) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Student code is required");
   }

   String studentCode = item.studentId().trim();
   String normalizedCode =
           studentCode.toLowerCase(java.util.Locale.ROOT);

   if (!submittedCodes.add(normalizedCode)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Duplicate student code: " + studentCode);
   }

   Student student = studentRepository
           .findByStudentCode(studentCode)
           .orElseThrow(() -> new ResponseStatusException(
                   HttpStatus.NOT_FOUND,
                   "Student not found: " + studentCode));

   if (student.getClassName() == null
           || !student.getClassName().equalsIgnoreCase(
           className)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Student " + studentCode
                    + " does not belong to class "
                    + className);
   }

   String status = normalizeStatus(item.status());

   // Update existing attendance for this student/date,
   // otherwise create a new record.
   AttendanceRecord record = attendanceRepository
           .findByStudentIdAndDate(studentCode, date)
           .orElseGet(AttendanceRecord::new);

   record.setStudent(student);
   record.setStudentId(student.getStudentCode());
   record.setStudentName(student.getName());
   record.setClassName(student.getClassName());
   record.setDate(date);
   record.setStatus(status);
   record.setNote(item.note());

   recordsToSave.add(record);
  }

  return attendanceRepository.saveAll(recordsToSave);
 }

 // PUT /api/attendance/{id}
 @PutMapping("/{id}")
 @Transactional
 public AttendanceRecord updateAttendance(
         @PathVariable Long id,
         @RequestBody AttendanceRecord request) {

  AttendanceRecord existing = attendanceRepository.findById(id)
          .orElseThrow(() -> new ResponseStatusException(
                  HttpStatus.NOT_FOUND,
                  "Attendance record not found"));

  if (request.getStatus() != null
          && !request.getStatus().isBlank()) {
   existing.setStatus(normalizeStatus(request.getStatus()));
  }

  if (request.getDate() != null) {
   existing.setDate(request.getDate());
  }

  if (request.getNote() != null) {
   existing.setNote(request.getNote());
  }

  return attendanceRepository.save(existing);
 }

 // DELETE /api/attendance/{id}
 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void deleteAttendance(@PathVariable Long id) {

  if (!attendanceRepository.existsById(id)) {
   throw new ResponseStatusException(
           HttpStatus.NOT_FOUND,
           "Attendance record not found");
  }

  attendanceRepository.deleteById(id);
 }

 private String normalizeStatus(String status) {

  if (status == null || status.isBlank()) {
   throw new ResponseStatusException(
           HttpStatus.BAD_REQUEST,
           "Attendance status is required");
  }

  if ("Present".equalsIgnoreCase(status.trim())) {
   return "Present";
  }

  if ("Absent".equalsIgnoreCase(status.trim())) {
   return "Absent";
  }

  throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Status must be Present or Absent");
 }
}
