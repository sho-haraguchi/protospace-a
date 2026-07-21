package in.tech_camp.backend.entity;

import lombok.Data;

@Data
public class UserEntity {
    private Integer id;
    private String name;
    private String email;
    private String password;
    private String profile;
    private String affiliation;
    private String position;
}
