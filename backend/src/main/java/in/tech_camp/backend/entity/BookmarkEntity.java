package in.tech_camp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookmarkEntity {
    private Integer id;
    private Integer userId;
    private Integer prototypeId;
    private LocalDateTime createdAt;
}