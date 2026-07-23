package in.tech_camp.backend.entity;

import lombok.Data;

@Data
public class CommentEntity {
    private Integer id;
    private String text;
    private Integer userId;
    private Integer prototypeId;
    private String userName;
}