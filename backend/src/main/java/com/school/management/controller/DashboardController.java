package com.school.management.controller;
import com.school.management.repository.*; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/dashboard") public class DashboardController {
 private final StudentRepository students; private final SchoolClassRepository classes; private final AttendanceRepository attendance;
 public DashboardController(StudentRepository students,SchoolClassRepository classes,AttendanceRepository attendance){this.students=students;this.classes=classes;this.attendance=attendance;}
 @GetMapping("/summary") public Map<String,Object> summary(){long total=students.count(),active=students.countByStatusIgnoreCase("Active"),graduated=students.countByStatusIgnoreCase("Graduated");double avg=students.findAll().stream().filter(s->s.getGpa()!=null).mapToDouble(s->s.getGpa().doubleValue()).average().orElse(0);return Map.of("totalStudents",total,"activeStudents",active,"graduatedStudents",graduated,"totalClasses",classes.count(),"averageGpa",Math.round(avg*10.0)/10.0);}
}
