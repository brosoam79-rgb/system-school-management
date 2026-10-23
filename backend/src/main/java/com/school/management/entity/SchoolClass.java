package com.school.management.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="school_classes", uniqueConstraints=@UniqueConstraint(columnNames="name")) @Getter @Setter @NoArgsConstructor
public class SchoolClass {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="class_code",nullable=false,unique=true) private String classCode;
 @Column(nullable=false,unique=true,length=40) private String name;
 @Column(length=120) private String teacher;
 @Column(length=60) private String room;
 @Column(length=120) private String schedule;
 @Column(length=120) private String subject;
}
