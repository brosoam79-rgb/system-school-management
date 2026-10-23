package com.school.management.controller;
import com.school.management.repository.ActivityRepository; import org.springframework.web.bind.annotation.*; import java.time.*; import java.time.format.DateTimeFormatter; import java.util.*;
@RestController @RequestMapping("/api/activities") public class ActivityController {
 private final ActivityRepository activities; public ActivityController(ActivityRepository activities){this.activities=activities;}
 @GetMapping public List<Map<String,Object>> all(){return activities.findTop20ByOrderByCreatedAtDesc().stream().map(a->{Map<String,Object> m=new LinkedHashMap<>();m.put("id",a.getId());m.put("type",a.getType());m.put("message",a.getMessage());m.put("time",DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault()).format(a.getCreatedAt()));m.put("icon",a.getIcon());return m;}).toList();}
}
