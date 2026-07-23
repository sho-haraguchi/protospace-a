package in.tech_camp.backend.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;


import java.util.List;

import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Result;
import in.tech_camp.backend.entity.PrototypeEntity;

@Mapper
public interface PrototypeRepository {
  // 投稿保存
    @Insert("INSERT INTO prototypes (name, slogan, concept, image, user_id) VALUES (#{name}, #{slogan}, #{concept}, #{image}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(PrototypeEntity prototype);
  
  //「プロトタイプ情報」と「投稿者の名前」を同時に取得するためJOIN句を使用
  @Select("SELECT prototypes.*, users.name AS user_name " +
          "FROM prototypes " +
          "JOIN users ON prototypes.user_id = users.id")
    @Results({
      //"user_name" として取得した投稿者の名前を"user"フィールドの"name"フィールドにセット
      @Result(property = "user.id", column = "user_id"),
      @Result(property = "user.name", column = "user_name")
    })
  List<PrototypeEntity> findAll();


  // プロトタイプ詳細画面表示
  @Select("SELECT p.*, u.id AS user_id, u.name AS user_name " +
            "FROM prototypes p " +
            "LEFT JOIN users u ON p.user_id = u.id " +
            "WHERE p.id = #{id}")
    @Results({
      @Result(property = "user.id", column = "user_id"),
      @Result(property = "user.name", column = "user_name"),
      @Result(property = "userId", column = "user_id") 
    })
    PrototypeEntity findById(Integer id);

    //プロトタイプ編集
  @Update("UPDATE prototypes SET name = #{name}, slogan = #{slogan}, concept = #{concept}, image = #{image} WHERE id = #{id}")
     void update(PrototypeEntity prototype);
}
