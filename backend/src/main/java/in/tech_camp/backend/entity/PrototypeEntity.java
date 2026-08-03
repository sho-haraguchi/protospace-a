package in.tech_camp.backend.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PrototypeEntity {
  private Integer id;
  private String name;
  private String slogan;
  private String image;
  private String concept;
  private Integer userId;
  //投稿者の名前表示するためUserEntityに関連
  private UserEntity user;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  //いいねの総数
    private Integer likeCount;
}
