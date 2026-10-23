package com.school.management.entity;
import jakarta.persistence.*; import lombok.*; import java.time.Instant;
@Entity @Table(name="activities") @Getter @Setter @NoArgsConstructor
public class Activity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=30) private String type;
 @Column(nullable=false,length=500) private String message;
 @Column(nullable=false) private Instant createdAt=Instant.now();
 @Column(length=30) private String icon;
}
