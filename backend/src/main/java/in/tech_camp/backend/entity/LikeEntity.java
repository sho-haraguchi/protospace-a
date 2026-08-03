package in.tech_camp.backend.entity;

import lombok.Data;

@Data
public class LikeEntity {
    private Integer id;
    private Integer userId;
    private Integer prototypeId;
}