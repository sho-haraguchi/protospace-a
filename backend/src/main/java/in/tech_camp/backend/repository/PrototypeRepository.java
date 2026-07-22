package in.tech_camp.backend.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Result;
import in.tech_camp.backend.entity.PrototypeEntity;

@Mapper
public interface PrototypeRepository {
  //「プロトタイプ情報」と「投稿者の名前」を同時に取得するためJOIN句を使用
  @Select("SELECT prototypes.*, users.name AS user_name " +
          "FROM prototypes " +
          "JOIN users ON prototypes.user_id = users.id")
    @Results({
      //"user_name" として取得した投稿者の名前を"user"フィールドの"name"フィールドにセット
      @Result(property = "user.name", column = "user_name")
    })
  List<PrototypeEntity> findAll();
}
